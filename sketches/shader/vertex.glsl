uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
uniform vec2 pixels;
uniform float playhead;
float PI = 3.141592653589793238;

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noised(vec3 x) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(x);
	vec3 f = fract(x);
 
	// For performance, compute the base input to a 1D hash from the integer part of the argument and the 
	// incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

void main() {
  vUv = uv;
  vNormal = normal;
  vec3 p = position;
  float noise = noised(4.*vec3(p.x, p.y + 0.2*cos(2.*PI*playhead), p.z + 0.2*sin(2.*PI*playhead)));
  noise =noise*(6. - noise);
  vNoise = noise;
  vec3 newposition = position + 0.1*noise*normalize(position); //lines have no normal, usually

  vec4 vView = modelViewMatrix * vec4( newposition, 1.0 );
  vPosition = vView.xyz;

  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  gl_PointSize = 25. * ( 1. / - mvPosition.z );

  gl_Position = projectionMatrix * vView;
}