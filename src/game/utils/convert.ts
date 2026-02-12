import {Vector} from 'excalibur';

export type VectorLike = Vector | [number, number];

/**
 * ```ts
 * toVector(undefined): undefined
 * toVector(new Vector(0 ,0)): Vector(0, 0)
 * toVector([0, 0]): Vector(0, 0)
 * toVector(1): Vector(1, 1)
 * toVector(1, 0): Vector(1, 0)
 * ```
 *
 * @param vectorOrX
 * @param y
 */
export function toVector<T extends VectorLike | undefined | number>(vectorOrX: T, y?: number): T extends undefined ? undefined : Vector {
    if (typeof vectorOrX === 'number') return new Vector(vectorOrX, y ?? vectorOrX) as any;
    if (!vectorOrX || (vectorOrX instanceof Vector)) return vectorOrX as any;
    return new Vector(...(vectorOrX as [number, number])) as any;
}