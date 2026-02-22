#version 300 es

precision mediump float;

in vec2 v_uv;

uniform vec2 u_graphic_resolution;
uniform vec2 u_resolution;
uniform float u_stars_factor;
uniform float u_time;
uniform bool u_blinking_enabled;
uniform vec4 u_star_from_color;
uniform vec4 u_star_to_color;

out vec4 out_color;

// Генератор псевдослучайных чисел (без изменений)
float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    return fract(sin(mod(dot(co.xy, vec2(a, b)), 3.14)) * c);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    const float tileSize = 30.0;
    vec2 tile = floor(fragCoord / tileSize);

    float starProbability = random(tile);
    vec3 finalColor = vec3(0.0);
    float time = u_time / 1500.0;

    if (starProbability < u_stars_factor) {
        // Смещения центра звезды (используем векторную арифметику для краткости)
        float offsetX = random(tile + vec2(0.0, 0.5));
        float offsetY = random(tile + vec2(0.5, 0.0));
        vec2 starCenter = (tile + vec2(offsetX, offsetY)) * tileSize;

        // Параметры звезды (все смещения теперь записаны как tile + константа)
        float starSize       = random(tile + vec2(1.0)) * 2.0 + 1.0;
        float baseBrightness = random(tile + vec2(2.0)) * 0.7 + 0.3;
        float hueShift       = random(tile + vec2(3.0));
        vec3 starColor       = mix(vec3(u_star_from_color), vec3(u_star_to_color), hueShift);

        float finalBrightness = baseBrightness;

        // Мерцание (если включено)
        if (u_blinking_enabled) {
            float blinkProb = random(tile + vec2(4.0));
            if (blinkProb < 0.2) {
                float activity = 0.5 + 0.5 * sin(time * 0.3 + random(tile + vec2(7.0)) * 20.0);
                float speed    = random(tile + vec2(5.0)) * 3.0 + 2.0;
                float phase    = random(tile + vec2(6.0)) * 2.0 * 3.14159;
                float blinkFactor = 0.7 + 0.6 * sin(time * speed + phase);
                float mergedFactor = mix(1.0, blinkFactor, activity);
                finalBrightness *= mergedFactor;
                finalBrightness = max(0.1, finalBrightness);
            }
        }

        // Отрисовка пикселя звезды
        float dist = distance(fragCoord, starCenter);
        if (dist < starSize) {
            float alpha = 1.0 - smoothstep(0.0, starSize, dist);
            finalColor = starColor * finalBrightness * alpha;
        }
    }

    out_color = vec4(finalColor, 1.0);
}