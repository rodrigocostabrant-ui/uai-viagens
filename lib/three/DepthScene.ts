// Foto viva com profundidade (Three.js). Módulo isolado do React:
// init → resize → update (a cada frame do ticker) → destroy.
// Carregado por import() só no tier "full" (desktop com mouse).

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  NoColorSpace,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";
import { particleFragment, particleVertex, photoFragment, photoVertex } from "./shaders";
import { damp, LAMBDA } from "@/lib/motion/tokens";

export type DepthSceneOptions = {
  image: ImageBitmap;
  imageWidth: number;
  imageHeight: number;
  depth: HTMLImageElement | null;
  /** object-position da <img>, em 0..1 (x, y a partir do topo). */
  objectPosition: [number, number];
  contrast: number;
  /** Saturação do filtro CSS saturate() (foto colorida, levemente contida). */
  saturate: number;
  brightness: number;
  /** Linha do horizonte na imagem, 0..1 a partir do topo (faixa da névoa). */
  horizon: number;
  particles: number;
  strength?: number;
};

const FOCUS = 0.42;
const DRIFT_AMPLITUDE = 0.6;
const DRIFT_FREQ: [number, number] = [0.21, 0.16]; // rad/s
const ENVELOPE_SECONDS = 2;
const MAX_DPR = 1.5;

export class DepthScene {
  private renderer: WebGLRenderer;
  private photoScene = new Scene();
  private photoCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private particleScene = new Scene();
  private particleCamera = new PerspectiveCamera(40, 1, 0.1, 10);
  private material: ShaderMaterial;
  private particleMaterial: ShaderMaterial | null = null;
  private imageTexture: Texture;
  private depthTexture: Texture;
  private disposables: Array<{ dispose(): void }> = [];
  private opts: DepthSceneOptions;
  private px = 0;
  private py = 0;
  private elapsed = 0;
  private envelopeStart = -1;
  private low = false;

  constructor(canvas: HTMLCanvasElement, opts: DepthSceneOptions) {
    this.opts = opts;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
    });
    // O shader trabalha nos valores sRGB crus, como os filtros CSS da <img>.
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.autoClear = false;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));

    this.imageTexture = new Texture(opts.image);
    this.imageTexture.colorSpace = NoColorSpace;
    this.imageTexture.flipY = false; // o ImageBitmap já vem invertido
    this.imageTexture.generateMipmaps = true;
    this.imageTexture.minFilter = LinearMipmapLinearFilter;
    this.imageTexture.magFilter = LinearFilter;
    this.imageTexture.needsUpdate = true;

    this.depthTexture = new Texture(opts.depth ?? undefined);
    this.depthTexture.colorSpace = NoColorSpace;
    this.depthTexture.minFilter = LinearFilter;
    this.depthTexture.magFilter = LinearFilter;
    this.depthTexture.generateMipmaps = false;
    if (opts.depth) this.depthTexture.needsUpdate = true;

    this.material = new ShaderMaterial({
      vertexShader: photoVertex,
      fragmentShader: photoFragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uImage: { value: this.imageTexture },
        uDepth: { value: this.depthTexture },
        uHasDepth: { value: opts.depth ? 1 : 0 },
        uCoverScale: { value: new Vector2(1, 1) },
        uCoverOffset: { value: new Vector2(0, 0) },
        uParallax: { value: new Vector2(0, 0) },
        uEnvelope: { value: 0 },
        uStrength: { value: opts.strength ?? 0.018 },
        uFocus: { value: FOCUS },
        uScroll: { value: 0 },
        uTime: { value: 0 },
        uContrast: { value: opts.contrast },
        uSaturate: { value: opts.saturate },
        uBrightness: { value: opts.brightness },
        uHorizon: { value: 1 - opts.horizon },
        uMist: { value: 0.25 },
        uWater: { value: opts.depth ? 1 : 0 },
        uGrain: { value: 0.03 },
      },
    });

    const plane = new PlaneGeometry(2, 2);
    this.photoScene.add(new Mesh(plane, this.material));
    this.disposables.push(plane, this.material, this.imageTexture, this.depthTexture);

    if (opts.particles > 0) this.addParticles(opts.particles);
    this.particleCamera.position.set(0, 0, 2);
  }

  private addParticles(count: number) {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * 1.3;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 0.8;
      positions[i * 3 + 2] = Math.random() * 1.6 - 0.6;
      phases[i] = Math.random();
      sizes[i] = 1.2 + Math.random() * 2.4;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aPhase", new BufferAttribute(phases, 1));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    this.particleMaterial = new ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uOpacity: { value: 0 },
      },
    });
    this.particleScene.add(new Points(geometry, this.particleMaterial));
    this.disposables.push(geometry, this.particleMaterial);
  }

  /**
   * Compila os shaders sem travar a thread principal (KHR_parallel_shader_compile)
   * e desenha um quadro para subir as texturas antes do crossfade.
   */
  async warmUp() {
    await this.renderer.compileAsync(this.photoScene, this.photoCamera);
    if (this.particleMaterial) await this.renderer.compileAsync(this.particleScene, this.particleCamera);
    this.draw();
  }

  resize(width: number, height: number) {
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    const canvasAspect = width / height;
    const imageAspect = this.opts.imageWidth / this.opts.imageHeight;
    let sx = 1;
    let sy = 1;
    if (canvasAspect > imageAspect) sy = imageAspect / canvasAspect;
    else sx = canvasAspect / imageAspect;
    const [px, py] = this.opts.objectPosition;
    // Janela visível em coordenadas da textura (y de baixo para cima).
    this.material.uniforms.uCoverScale.value.set(sx, sy);
    this.material.uniforms.uCoverOffset.value.set((1 - sx) * px, (1 - sy) * (1 - py));
    this.particleCamera.aspect = canvasAspect;
    this.particleCamera.updateProjectionMatrix();
  }

  /** Começa a animação (a partir do quadro idêntico à <img>). */
  start() {
    this.envelopeStart = this.elapsed;
  }

  /** Versão mais leve: DPR 1, sem partículas e sem grão. */
  degrade() {
    if (this.low) return;
    this.low = true;
    this.renderer.setPixelRatio(1);
    const size = this.renderer.getSize(new Vector2());
    this.renderer.setSize(size.x, size.y, false);
    this.material.uniforms.uGrain.value = 0;
    this.particleScene.clear();
  }

  get isLow() {
    return this.low;
  }

  /**
   * Um frame. pointerX/Y em [-1, 1] (y para baixo), ou null sem mouse.
   * Devolve o tempo de CPU gasto no draw, em ms.
   */
  update(dt: number, pointerX: number | null, pointerY: number | null, scroll: number) {
    this.elapsed += dt;
    const t = this.elapsed;
    const envelope =
      this.envelopeStart < 0 ? 0 : smoothstep(Math.min(1, (t - this.envelopeStart) / ENVELOPE_SECONDS));

    this.px = damp(this.px, pointerX ?? 0, LAMBDA.heroDepth, dt);
    this.py = damp(this.py, pointerY ?? 0, LAMBDA.heroDepth, dt);
    const driftX = Math.sin(t * DRIFT_FREQ[0]) * DRIFT_AMPLITUDE;
    const driftY = Math.cos(t * DRIFT_FREQ[1]) * DRIFT_AMPLITUDE * 0.6;
    // y do ponteiro cresce para baixo; em UV, para cima.
    const parallaxX = clamp(this.px + driftX, -1.4, 1.4);
    const parallaxY = clamp(-this.py + driftY, -1.4, 1.4);

    const u = this.material.uniforms;
    u.uParallax.value.set(parallaxX, parallaxY);
    u.uEnvelope.value = envelope;
    u.uScroll.value = scroll;
    u.uTime.value = t % 600;

    if (this.particleMaterial) {
      this.particleMaterial.uniforms.uTime.value = t % 600;
      this.particleMaterial.uniforms.uOpacity.value = envelope;
      this.particleCamera.position.x = parallaxX * 0.1;
      this.particleCamera.position.y = parallaxY * 0.06;
      this.particleCamera.lookAt(0, 0, 0);
    }

    const before = performance.now();
    this.draw();
    return performance.now() - before;
  }

  private draw() {
    this.renderer.clear();
    this.renderer.render(this.photoScene, this.photoCamera);
    if (this.particleMaterial && !this.low) this.renderer.render(this.particleScene, this.particleCamera);
  }

  destroy() {
    for (const d of this.disposables) d.dispose();
    this.opts.image.close();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(x: number) {
  return x * x * (3 - 2 * x);
}
