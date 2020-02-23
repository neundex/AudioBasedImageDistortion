#ifdef GL_ES
  precision mediump float;
#endif

varying vec2 vTexCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_tResolution;
uniform sampler2D u_texture;
uniform float u_bass;
uniform float u_tremble;
uniform float u_mid;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main() {
  vec2 ratio = vec2(
    min((u_resolution.x / u_resolution.y) / (u_tResolution.x / u_tResolution.y), 1.0),
    min((u_resolution.y / u_resolution.x) / (u_tResolution.y / u_tResolution.x), 1.0)
  );

  vec2 uv = vec2(
    vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  uv.y = 1.0 - uv.y;

  uv -= vec2(0.5);
  uv = scale(vec2(0.91)) * uv;
  uv += vec2(0.5);

  float wave_x = sin(uv.x * u_bass + u_time) * u_mid;
  float wave_y = sin(uv.y * u_bass / 2.0) * u_mid;
  vec2 d = vec2(wave_x, wave_y);

  vec4 image = texture2D(u_texture, uv + d);

  gl_FragColor = image;
}