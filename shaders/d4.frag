#ifdef GL_ES
  precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D d_map;
uniform sampler2D img;
uniform float u_bass;
uniform float u_mid;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_tResolution;

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

  vec4 texture = texture2D(d_map, uv);

  float d = dot(texture.rgb, vec3(u_time));
  float disp = d * u_bass;
  float disp_2 = d * u_mid;

  uv.y += disp;

  vec4 image = texture2D(img, uv);

  gl_FragColor = image;
}