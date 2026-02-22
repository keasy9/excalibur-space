#version 300 es
precision mediump float;

// todo перечитать и актуализировать - нейрокод

in vec2 v_uv;

uniform float u_size;               // детализация внутри облака
uniform float u_cloud_size;          // размер облачных масс
uniform float u_amount;           // кол-во туманности
uniform float u_sharpness;           // резкость границ
uniform int u_octaves;               // октавы шума

uniform vec3 u_color_low;            // нижний цвет для звёзд
uniform vec3 u_color_high;           // верхний цвет для звёзд

out vec4 out_color;

// ---------- функции шума ----------
float rand(vec2 coord) {
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453);
}

float noise(vec2 coord) {
    vec2 i = floor(coord);
    vec2 f = fract(coord);
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    vec2 cubic = f * f * (3.0 - 2.0 * f);
    return mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;
}

float fbm(vec2 coord) {
    float value = 0.0;
    float scale = 0.5;
    int oct = u_octaves;
    for (int i = 0; i < 20; i++) {
        if (i >= oct) break;
        value += noise(coord) * scale;
        coord *= 2.0;
        scale *= 0.5;
    }
    return value;
}

void main() {
    float amount = mix(0.22, 0.8, u_amount);
    float threshold = mix(1.0, 0.0,  amount);

    // ----- маска облаков (низкая частота) -----
    float mask = fbm(v_uv * u_cloud_size);
    mask = smoothstep(threshold, threshold + u_sharpness, mask);

    // ----- детали внутри облаков (высокая частота) -----
    float detail = fbm(v_uv * u_size) - 0.4 * u_amount;
    detail = pow(detail, 1.5);

    // итоговая плотность облака
    float cloudDensity = mask * detail;
    float cloudAlpha = cloudDensity;

    // облако всегда серое (белое)
    vec3 cloudColor = vec3(1.0) * cloudAlpha;

    // ----- звёзды (только там, где есть облако) -----
    vec3 starColor = vec3(0.0);
    float starIntensity = 0.0;

    if (cloudAlpha > 0.0) {
        // определяем ячейку звезды
        vec2 starUV = v_uv * 30.0;
        vec2 gridIdx = floor(starUV);
        vec2 gridPos = fract(starUV);

        // четыре случайных числа для одной ячейки
        float r1 = rand(gridIdx);
        float r2 = rand(gridIdx + vec2(1.0, 0.0));
        float r3 = rand(gridIdx + vec2(2.0, 0.0));
        float r4 = rand(gridIdx + vec2(3.0, 0.0));
        float r5 = rand(gridIdx + vec2(4.0, 0.0)); // для цвета

        // центр звезды внутри ячейки
        vec2 starCenter = vec2(r1, r2);
        // радиус звезды
        float starRadius = mix(0.1, 0.15, r3);
        // вероятность появления звезды в этой ячейке
        float starExists = step(r4, 0.6);

        // расстояние до центра
        float dist = length(gridPos - starCenter);
        // интенсивность: 1 внутри круга, плавно спадает к краю
        float starVal = starExists * (1.0 - smoothstep(0.0, starRadius, dist));

        // цвет звезды случайный в диапазоне [low, high]
        vec3 randomStarColor = mix(u_color_low, u_color_high, r5);

        // интенсивность звезды модулируется плотностью облака и общей яркостью
        starIntensity = starVal * 3.0 * cloudAlpha;
        starColor = randomStarColor;
    }

    // ----- финальный цвет (premultiplied alpha) -----
    // аддитивно добавляем звёзды к облаку
    vec3 finalRgb = cloudColor + starColor * starIntensity;
    float finalAlpha = cloudAlpha; // альфа остаётся от облака (звёзды её не увеличивают)

    out_color = vec4(finalRgb, finalAlpha);
}