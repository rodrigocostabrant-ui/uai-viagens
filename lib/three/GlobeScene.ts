// Globo da seção Destinos. Esfera com duas texturas desenhadas em canvas a partir
// de public/data/globo.json (contornos em espaço 360×180, x = lon+180, y = 90−lat):
//   uMap — visual (oceano, graticule, terra, continentes, pontos vermelhos nos países
//          da galeria)
//   uIds — mapa de ids (R = id·8, G = cobertura), lido no shader para acender o
//          continente sob o mouse e o selecionado sem redesenhar nem reenviar textura.
// O mesmo mapa de ids, lido na CPU, resolve o clique.

import {
  CanvasTexture,
  LinearSRGBColorSpace,
  Mesh,
  NearestFilter,
  NoColorSpace,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShaderMaterial,
  Sphere,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { damp } from "@/lib/motion/tokens";

export type GlobeData = { land: string; borders: string; regions: Record<string, string> };
/** Região clicável (continente), com o centro para onde o globo gira. */
export type GlobeRegion = { id: string; lat: number; lon: number };
/** Ponto vermelho; clicar perto dele (ilhas pequenas demais no mapa) abre a região. */
export type GlobeMarker = { lat: number; lon: number; region: string };

type Options = {
  canvas: HTMLCanvasElement;
  data: GlobeData;
  regions: GlobeRegion[];
  markers: GlobeMarker[];
  reduced: boolean;
  mobile: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

const COLORS = {
  ocean: "#101010",
  grid: "#1c1c1c",
  land: "#2c2c2c",
  border: "#121212",
  pick: "#474747",
  dot: "#e0262e",
};
const MAX_PITCH = 1.15;
const AUTO_SPEED = 0.05; // rad/s
const IDLE_MS = 5000;

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uIds;
  uniform float uHover;
  uniform float uSelected;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 base = texture2D(uMap, vUv).rgb;
    vec4 idc = texture2D(uIds, vUv);
    float id = idc.g > 0.5 ? floor(idc.r / idc.g * 255.0 / 8.0 + 0.5) : 0.0;
    float isHover = step(0.5, id) * (1.0 - step(0.5, abs(id - uHover)));
    float isSel = step(0.5, id) * (1.0 - step(0.5, abs(id - uSelected)));
    vec3 red = vec3(0.878, 0.149, 0.180);
    base = mix(base, red * 0.85, isHover * 0.7);
    base = mix(base, red, isSel);
    vec3 n = normalize(vNormal);
    float light = max(dot(n, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
    vec3 col = base * (0.5 + 0.7 * light);
    float rim = pow(1.0 - max(n.z, 0.0), 3.0);
    col += vec3(rim * 0.12);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Rotação (yaw, pitch) que traz lat/lon para a frente da câmera. */
function facing(lat: number, lon: number) {
  return { yaw: -Math.PI / 2 - (lon * Math.PI) / 180, pitch: (lat * Math.PI) / 180 };
}
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export class GlobeScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(30, 1, 0.1, 20);
  private globe: Mesh<SphereGeometry, ShaderMaterial>;
  private raycaster = new Raycaster();
  private unit = new Sphere(new Vector3(), 1);
  private hitPoint = new Vector3();
  private hoverDirty = false;
  private ids: Uint8ClampedArray;
  private idW: number;
  private idH: number;
  private index = new Map<string, number>();
  private byId: string[] = [];
  private opts: Options;

  private yaw: number;
  private pitch: number;
  private targetYaw: number | null = null;
  private targetPitch: number | null = null;
  private velocity = 0;
  private dragging: { x: number; y: number; moved: number; touch: boolean } | null = null;
  private lastInput = -Infinity;
  private hovered: string | null = null;
  private pointerNdc: Vector2 | null = null;
  private dirty = true;
  private disposed = false;

  constructor(opts: Options) {
    this.opts = opts;
    const { canvas, data, regions, markers, mobile } = opts;
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);

    regions.forEach((r, i) => {
      this.index.set(r.id, i + 1);
      this.byId[i + 1] = r.id;
    });

    const map = this.drawMap(data, regions, markers, mobile ? 2048 : 4096);
    const idCanvas = this.drawIds(data, regions, 2048);
    this.idW = idCanvas.width;
    this.idH = idCanvas.height;
    this.ids = idCanvas.getContext("2d")!.getImageData(0, 0, this.idW, this.idH).data;

    const mapTex = new CanvasTexture(map);
    mapTex.colorSpace = NoColorSpace;
    mapTex.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    const idTex = new CanvasTexture(idCanvas);
    idTex.colorSpace = NoColorSpace;
    idTex.magFilter = NearestFilter;
    idTex.minFilter = NearestFilter;
    idTex.generateMipmaps = false;

    this.globe = new Mesh(
      new SphereGeometry(1, 128, 96),
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uMap: { value: mapTex }, uIds: { value: idTex }, uHover: { value: 0 }, uSelected: { value: 0 } },
      }),
    );
    this.scene.add(this.globe);

    // Começa mostrando a América do Sul (o Brasil de quem está visitando).
    const start = facing(-12, -48);
    this.yaw = start.yaw;
    this.pitch = start.pitch * 0.6;
    this.applyRotation();
    this.bind();
  }

  private drawMap(data: GlobeData, regions: GlobeRegion[], markers: GlobeMarker[], width: number) {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = width / 2;
    const ctx = c.getContext("2d")!;
    const k = width / 360;
    ctx.fillStyle = COLORS.ocean;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.scale(k, k);
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1 / k;
    ctx.beginPath();
    for (let lon = 0; lon <= 360; lon += 15) {
      ctx.moveTo(lon, 0);
      ctx.lineTo(lon, 180);
    }
    for (let lat = 15; lat < 180; lat += 15) {
      ctx.moveTo(0, lat);
      ctx.lineTo(360, lat);
    }
    ctx.stroke();
    ctx.fillStyle = COLORS.land;
    ctx.fill(new Path2D(data.land));
    ctx.fillStyle = COLORS.pick;
    for (const { id } of regions) {
      const d = data.regions[id];
      if (d) ctx.fill(new Path2D(d));
    }
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1.4 / k;
    ctx.stroke(new Path2D(data.borders));
    ctx.fillStyle = COLORS.dot;
    for (const { lat, lon } of markers) {
      ctx.beginPath();
      ctx.arc(lon + 180, 90 - lat, 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return c;
  }

  private drawIds(data: GlobeData, regions: GlobeRegion[], width: number) {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = width / 2;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    const k = width / 360;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.scale(k, k);
    for (const { id } of regions) {
      const d = data.regions[id];
      if (!d) continue;
      ctx.fillStyle = `rgb(${this.index.get(id)! * 8}, 255, 0)`;
      ctx.fill(new Path2D(d));
    }
    return c;
  }

  private bind() {
    const el = this.opts.canvas;
    el.addEventListener("pointerdown", this.onDown);
    el.addEventListener("pointermove", this.onMove);
    el.addEventListener("pointerup", this.onUp);
    el.addEventListener("pointercancel", this.onCancel);
    el.addEventListener("pointerleave", this.onLeave);
  }

  private ndc(e: PointerEvent) {
    const r = this.opts.canvas.getBoundingClientRect();
    return new Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  private onDown = (e: PointerEvent) => {
    this.dragging = { x: e.clientX, y: e.clientY, moved: 0, touch: e.pointerType !== "mouse" };
    this.velocity = 0;
    this.targetYaw = this.targetPitch = null;
    this.lastInput = performance.now();
    if (e.pointerType === "mouse") {
      e.preventDefault(); // sem seleção de texto ao arrastar para fora do globo
      this.opts.canvas.setPointerCapture(e.pointerId);
    }
  };

  private onMove = (e: PointerEvent) => {
    const d = this.dragging;
    if (d) {
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.moved += Math.abs(dx) + Math.abs(dy);
      const size = this.opts.canvas.clientHeight || 500;
      const speed = 3.2 / size;
      this.yaw += dx * speed;
      this.velocity = (dx * speed) / (1 / 60);
      // No toque, o arrasto vertical é da página: só gira na horizontal.
      if (!d.touch) this.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this.pitch + dy * speed));
      d.x = e.clientX;
      d.y = e.clientY;
      this.lastInput = performance.now();
      this.dirty = true;
      return;
    }
    if (e.pointerType === "mouse") {
      this.pointerNdc = this.ndc(e);
      this.hoverDirty = true;
    }
  };

  private onUp = (e: PointerEvent) => {
    const d = this.dragging;
    this.dragging = null;
    if (d && d.moved < 6) {
      const id = this.pick(this.ndc(e), e.pointerType !== "mouse");
      if (id) this.opts.onSelect(id);
    }
  };

  private onCancel = () => {
    this.dragging = null;
  };

  private onLeave = () => {
    this.pointerNdc = null;
    this.setHover(null);
  };

  /** Continente sob o ponto da tela; perto de um ponto vermelho (ilha pequena), o dele. */
  private pick(ndc: Vector2, generous = false): string | null {
    // Interseção analítica raio × esfera unitária (barata o bastante para o hover a cada quadro)
    this.raycaster.setFromCamera(ndc, this.camera);
    if (!this.raycaster.ray.intersectSphere(this.unit, this.hitPoint)) return null;
    this.globe.updateMatrixWorld();
    const p = this.globe.worldToLocal(this.hitPoint).normalize();
    const lat = (Math.asin(p.y) * 180) / Math.PI;
    const lon = (Math.atan2(-p.z, p.x) * 180) / Math.PI;
    const x = Math.min(this.idW - 1, Math.floor(((lon + 180) / 360) * this.idW));
    const y = Math.min(this.idH - 1, Math.floor(((90 - lat) / 180) * this.idH));
    const o = (y * this.idW + x) * 4;
    const g = this.ids[o + 1];
    if (g > 128) {
      const id = Math.round(this.ids[o] / (g / 255) / 8);
      if (this.byId[id]) return this.byId[id];
    }
    // Tolerância: pontos vermelhos a até 2,5° (4° no toque)
    const limit = ((generous ? 4 : 2.5) * Math.PI) / 180;
    let best: string | null = null;
    let bestD = limit;
    const la1 = (lat * Math.PI) / 180;
    for (const m of this.opts.markers) {
      const la2 = (m.lat * Math.PI) / 180;
      const dl = ((m.lon - lon) * Math.PI) / 180;
      const dist = Math.acos(Math.min(1, Math.sin(la1) * Math.sin(la2) + Math.cos(la1) * Math.cos(la2) * Math.cos(dl)));
      if (dist < bestD) {
        bestD = dist;
        best = m.region;
      }
    }
    return best;
  }

  private setHover(id: string | null) {
    if (id === this.hovered) return;
    this.hovered = id;
    this.globe.material.uniforms.uHover.value = id ? this.index.get(id)! : 0;
    this.opts.canvas.style.cursor = id ? "pointer" : "grab";
    this.opts.onHover(id);
    this.dirty = true;
  }

  setSelected(id: string | null) {
    this.globe.material.uniforms.uSelected.value = id ? (this.index.get(id) ?? 0) : 0;
    this.dirty = true;
  }

  /** Gira até a região (caminho mais curto). */
  focus(id: string) {
    const c = this.opts.regions.find((x) => x.id === id);
    if (!c) return;
    const f = facing(c.lat, c.lon);
    this.targetYaw = this.yaw + wrap(f.yaw - this.yaw);
    this.targetPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, f.pitch));
    this.velocity = 0;
    this.lastInput = performance.now();
    if (this.opts.reduced) {
      this.yaw = this.targetYaw;
      this.pitch = this.targetPitch;
      this.targetYaw = this.targetPitch = null;
    }
    this.dirty = true;
  }

  resize(width: number, height: number) {
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Cabe a esfera (raio 1) no menor lado, com 6% de folga.
    const vFov = (this.camera.fov * Math.PI) / 180;
    const fit = Math.min(1, this.camera.aspect);
    const dist = 1.06 / Math.sin(Math.atan(Math.tan(vFov / 2) * fit));
    this.camera.position.set(0, 0, dist);
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  private applyRotation() {
    this.globe.rotation.set(this.pitch, this.yaw, 0, "XYZ");
  }

  /** Um quadro. dt em segundos. */
  update(dt: number) {
    if (this.disposed) return;
    const now = performance.now();
    if (this.targetYaw !== null && this.targetPitch !== null) {
      this.yaw = damp(this.yaw, this.targetYaw, 5, dt);
      this.pitch = damp(this.pitch, this.targetPitch, 5, dt);
      if (Math.abs(this.yaw - this.targetYaw) < 0.001 && Math.abs(this.pitch - this.targetPitch) < 0.001) {
        this.targetYaw = this.targetPitch = null;
      }
      this.dirty = true;
    } else if (!this.dragging) {
      if (Math.abs(this.velocity) > 0.01 && !this.opts.reduced) {
        this.yaw += this.velocity * dt;
        this.velocity = damp(this.velocity, 0, 3, dt);
        this.dirty = true;
      } else if (!this.opts.reduced && !this.globe.material.uniforms.uSelected.value && now - this.lastInput > IDLE_MS) {
        this.yaw += AUTO_SPEED * dt;
        this.dirty = true;
      }
    }
    if (this.dirty) this.applyRotation();
    if (this.pointerNdc && !this.dragging && (this.hoverDirty || this.dirty)) {
      this.hoverDirty = false;
      this.setHover(this.pick(this.pointerNdc));
    }
    if (this.dirty) {
      this.renderer.render(this.scene, this.camera);
      this.dirty = false;
    }
  }

  destroy() {
    this.disposed = true;
    const el = this.opts.canvas;
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointermove", this.onMove);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("pointercancel", this.onCancel);
    el.removeEventListener("pointerleave", this.onLeave);
    const m = this.globe.material;
    (m.uniforms.uMap.value as CanvasTexture).dispose();
    (m.uniforms.uIds.value as CanvasTexture).dispose();
    m.dispose();
    this.globe.geometry.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
