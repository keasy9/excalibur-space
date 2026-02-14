#version 300 es

precision mediump float;

#define PI 3.14159265359

in vec2 v_uv;

uniform vec2 u_resolution;
uniform vec2 u_size;
uniform float u_time;

out vec4 fragColor;

vec3 colorA = vec3(1.0,0.512,0.0);
vec3 colorB = vec3(1.000,0.0,0.224);

float easeInOutQuad(float x) {
    if (x < 0.5) {
        return 8.0 * x * x * x * x;
    }
    return 1.0 - pow(- 2.0 * x + 2.0, 4.0) / 2.0;
}

float plot(vec2 st, float pct) {
    return smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
}

void main() {
    vec3 color = vec3(0.0);

    float pct = (sin(u_time / 1000.0) + 1.0) / 2.0;

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, easeInOutQuad(pct));

    fragColor = vec4(color,1.0);
}
