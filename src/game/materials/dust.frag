#version 300 es
precision lowp float;

in vec2 v_uv;

uniform float u_size;               // детализация внутри облака
uniform float u_cloud_size;          // размер облачных масс
uniform float u_amount;              // кол-во туманности
uniform float u_sharpness;           // резкость границ

uniform vec3 u_color_low;            // нижний цвет для звёзд
uniform vec3 u_color_high;           // верхний цвет для звёзд

out vec4 out_color;

// Константы
#define OCTAVES 4

// Быстрый хеш без sin/cos
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Шум с интерполяцией (билинейная)
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

// Фрактальный шум
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
    float amount = mix(0.22, 0.8, u_amount);
    float threshold = mix(1.0, 0.0, amount);

    // Маска облаков (низкая частота)
    float mask = fbm(v_uv * u_cloud_size);
    mask = smoothstep(threshold, threshold + u_sharpness, mask);

    // Детали внутри облаков (высокая частота)
    float detail = fbm(v_uv * u_size) - 0.4 * u_amount;
    detail = max(detail, 0.0);
    detail = detail * detail; // вместо pow(detail, 1.5)

    // Плотность облака
    float cloudDensity = mask * detail;
    float cloudAlpha = cloudDensity;
    vec3 cloudColor = vec3(1.0) * cloudAlpha;

/**    // Звёзды (упрощённая версия)
    vec3 starColor = vec3(0.0);
    float starIntensity = 0.0;

    // Используем высокочастотный шум для звёзд
    float starsNoise = fbm(v_uv * 40.0); // большая частота
    starsNoise = pow(max(starsNoise - 0.7, 0.0), 2.0) * 5.0; // порог и усиление
    starIntensity = starsNoise * cloudAlpha;

    // Цвет звёзд на основе координат (простой способ)
    vec2 noiseCoord = floor(v_uv * 40.0);
    float randomColor = hash(noiseCoord);
    starColor = mix(u_color_low, u_color_high, randomColor);*/

    // Финальный цвет
    vec3 finalRgb = cloudColor/** + starColor * starIntensity*/;
    float finalAlpha = cloudAlpha;

    out_color = vec4(finalRgb, finalAlpha);
}