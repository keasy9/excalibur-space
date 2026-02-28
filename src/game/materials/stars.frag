#version 300 es

precision lowp float;

in vec2 v_uv;
in vec2 v_screenuv;

uniform float u_stars_factor;
uniform float u_time;
uniform bool u_blinking_enabled;
uniform vec4 u_star_from_color;
uniform vec4 u_star_to_color;

out vec4 out_color;

float noice(in vec2 x)
{
    float xhash = cos(x.x * 37.0);
    float yhash = cos(x.y * 57.0);
    return fract(415.92653 * (xhash + yhash));
}

float blink(float x){
    return pow(cos(3.14 * x / 2.0), 0.5);
}

vec4 star_color(in vec2 pos, float threshold)
{
    float star = noice(pos);
    vec4 color = vec4(0.0);

    if (star >= threshold) {
        float blinkFactor = noice(pos + 10.0);

        star = pow((star - threshold) / (1.0 - threshold), 6.0);

        if (u_blinking_enabled) {
            float time = blink((sin(u_time * noice(pos + 5.0)) + 1.0) / 2.0);
            star = star * time;
        }

        color = mix(u_star_from_color, u_star_to_color, blinkFactor);

    } else {
        star = 0.0;

    }

    return vec4(color.rgb * star, star);
}

void main() {
    float threshold = mix(1.0, 0.98, u_stars_factor);

    out_color = star_color(v_uv, threshold);
}
