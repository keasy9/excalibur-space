#version 300 es

precision mediump float;

#define PI 3.14159265359

in vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_size;
uniform float u_stars_factor;
uniform float u_blinking_enabled;
uniform sampler2D u_texture;

out vec4 fragColor;

const float MAX_SCREEN_COVERAGE = .002;

void main() {
    fragColor = texture(u_texture, v_uv);
}
