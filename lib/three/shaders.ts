// GLSL da foto viva. Sintaxe GLSL1: o three converte para WebGL2 e escolhe a
// precisão (highp quando o aparelho suporta).

const common = /* glsl */ `
  // Hash sem sin(): estável em GPUs móveis com mediump.
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
               mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + 17.0;
      a *= 0.5;
    }
    return v;
  }
`;

export const photoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const photoFragment = /* glsl */ `
  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform float uHasDepth;
  uniform vec2 uCoverScale;   // fração da imagem visível (object-fit: cover)
  uniform vec2 uCoverOffset;  // início da janela (object-position)
  uniform vec2 uParallax;     // ponteiro suavizado + drift, em [-1, 1]
  uniform float uEnvelope;    // 0 no repouso (quadro idêntico à <img>) → 1
  uniform float uStrength;
  uniform float uFocus;
  uniform float uScroll;
  uniform float uTime;        // já limitado a um intervalo pequeno no JS
  uniform float uContrast;
  uniform float uBrightness;
  uniform float uHorizon;     // y da linha do horizonte, de baixo para cima
  uniform float uMist;
  uniform float uWater;
  uniform float uGrain;
  varying vec2 vUv;

  ${common}

  vec3 softLight(vec3 b, vec3 s) {
    // W3C soft-light com a cor do véu (#26303c, todos os canais < 0.5)
    return b - (1.0 - 2.0 * s) * b * (1.0 - b);
  }

  void main() {
    // Overscan cresce junto com o envelope: no repouso não há zoom.
    float zoom = 1.0 + 0.045 * uEnvelope;
    vec2 center = uCoverOffset + 0.5 * uCoverScale;
    vec2 uv = center + (vUv - 0.5) * uCoverScale / zoom;

    vec4 depthTex = texture2D(uDepth, uv);
    float d = mix(0.35, depthTex.r, uHasDepth);

    vec2 offset = uParallax * (d - uFocus) * uStrength * uEnvelope;
    offset.y += uScroll * (d - uFocus) * 0.04 * uHasDepth;
    vec2 st = uv + offset;

    // Água: ondulação horizontal lenta, só onde a máscara (canal G) permite.
    float water = depthTex.g * uWater * uEnvelope;
    float ripple = noise(vec2(st.x * 9.0, st.y * 90.0 - uTime * 0.45)) - 0.5;
    st.x += ripple * 0.0018 * water;
    st.y += (noise(vec2(st.x * 30.0 + uTime * 0.2, st.y * 140.0)) - 0.5) * 0.0009 * water;

    vec3 col = texture2D(uImage, clamp(st, 0.0, 1.0)).rgb;

    // Mesmo filtro da <img>: grayscale → contrast → clamp → brightness (valores gamma, sem linearizar)
    float g = dot(col, vec3(0.2126, 0.7152, 0.0722));
    g = clamp((g - 0.5) * uContrast + 0.5, 0.0, 1.0);
    g *= uBrightness;

    // Névoa na faixa do horizonte
    float band = exp(-pow((st.y - uHorizon) / 0.07, 2.0));
    float mist = fbm(vec2(st.x * 3.0 + uTime * 0.012, st.y * 9.0 - uTime * 0.004));
    g = mix(g, 0.8, smoothstep(0.35, 0.8, mist) * band * uMist * uEnvelope);

    // Véu soft-light #26303c a 50% (o DOM esconde a camada dele enquanto o canvas vive)
    vec3 base = vec3(g);
    vec3 veiled = mix(base, softLight(base, vec3(0.149, 0.188, 0.235)), 0.5);

    // Grão
    float grain = hash12(gl_FragCoord.xy + floor(uTime * 24.0) * vec2(17.0, 29.0)) - 0.5;
    veiled += grain * uGrain * uEnvelope;

    gl_FragColor = vec4(veiled, 1.0);
  }
`;

export const particleVertex = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Deriva lenta para cima e de lado; reaparece embaixo.
    p.y = mod(p.y + uTime * (0.012 + aPhase * 0.01) + 0.8, 1.6) - 0.8;
    p.x += sin(uTime * 0.18 + aPhase * 6.2831) * 0.04;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (2.2 / -mv.z);
    vAlpha = 0.05 + 0.11 * aPhase;
  }
`;

export const particleFragment = /* glsl */ `
  varying float vAlpha;
  uniform float uOpacity;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r) * vAlpha * uOpacity;
    gl_FragColor = vec4(vec3(0.92), a);
  }
`;
