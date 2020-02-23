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
uniform vec2 texRes;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main() {

  vec2 ratio = vec2(
    min((u_resolution.x / u_resolution.y) / (texRes.x / texRes.y), 1.0),
    min((u_resolution.y / u_resolution.x) / (texRes.y / texRes.x), 1.0)
  );

  vec2 uv = vec2(
    vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  uv.y = 1.0 - uv.y;

  vec2 uvt = uv;

  vec2 translate = vec2(cos(u_mid),sin(u_mid));
  uvt += translate*0.35;

  vec4 t = texture2D(d_map, uvt);

  float d = dot(t.rgb, vec3(u_time));
  float disp = d * u_bass;
  float disp_2 = d * u_mid;

  uv -= vec2(0.5);
  uv = scale(2.0 - vec2(sin(disp)+1.0) ) * uv;
  uv += vec2(0.5);

  vec2 mir = uv;
  vec4 f = texture2D(img, mir);

  // output the image
  gl_FragColor = f;
}