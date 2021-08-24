uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
float PI = 3.141592653589793238;
void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	// ajoute les triangles sur la forme qui bouge
	vec3 X = dFdx(vPosition);
	vec3 Y = dFdy(vPosition);
	vec3 n=normalize(cross(X,Y));

	gl_FragColor = vec4(0.,0.,0.,1.);
	// gl_FragColor = vec4(vPosition,1.);
	// gl_FragColor = vec4(n,1.);
	// gl_FragColor = vec4(vec3(vNoise),1.);
}