import {toVector, VectorLike} from '@/game/utils/convert';

export function roundToPrecision(num: number, precision: number) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

export function randomByVec(vectorOrX: VectorLike|number, y?: number): number {
    const vec = toVector(vectorOrX, y);

    const r = Math.sin(vec.x * 12.9898 + vec.y * 78.233 % 3.14) * 43758.5453;
    return r - Math.floor(r); // только дробная часть
}
