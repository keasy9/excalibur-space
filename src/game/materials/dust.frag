#version 300 es

// todo оптимизация, на мобильных устройствах жрёт до 30 FPS!

precision lowp float;

in vec2 v_uv;

uniform float u_amount; // кол-во туманности

uniform vec4 u_color_low; // цвет границ пыли
uniform vec4 u_color_high; // цвет облаков пыли

out vec4 out_color;

#define OCTAVES 4 // кол-во слоёв тумана

/**
 * Рандом на основе целочисленного хэша. Работает намного лучше и быстрее синуса.
 */
float hash(in vec2 x) {
    return fract(415.92653 * (cos(x.x * 37.0) + cos(x.y * 57.0)));
}

/**
 * Шум с билинейной интерполяцией
 */
float noise(vec2 coord) {
    vec2 i = floor(coord);
    vec2 f = fract(coord);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f); // кубическая кривая
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

/**
 * Туман (слоистый шум)
 */
float fbm(vec2 coord) {
    float value = 0.0;
    float amp = 0.5;

    for (int i = 0; i < OCTAVES; i++) {
        value += noise(coord) * amp;
        coord *= 2.0;
        amp *= 0.5;
    }
    return value;
}

void main() {
    // нормализуем кол-во пыли
    float amount = mix(0.35, 0.6, u_amount);
    float threshold = mix(1.0, 0.0, amount);

    // маска облаков
    float mask = fbm(v_uv * 6.0); // * 6.0 - подгонка для лучшего визуала
    mask = smoothstep(threshold, threshold + 0.7, mask);

    // детали внутри облаков
    float detail = fbm(
        v_uv * 5.0 + 3.0 //  * 4.0 + 4.0 - подгонка для лучшего визуала
    );
    detail = max(detail, 0.0);
    detail = detail * detail; // защита от отрицательных значений

    // плотность облака, она же его альфа
    float cloudDensity = mix(0.0, 1.0 - u_amount * 0.2, mask * detail);

    out_color = vec4(mix(u_color_high.rgb, u_color_low.rgb, cloudDensity) * cloudDensity, cloudDensity);
}