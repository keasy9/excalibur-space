import {BoundingBox, randomIntInRange, Vector} from 'excalibur';

export function randomVector(bounds: BoundingBox): Vector {
    return new Vector(
        randomIntInRange(bounds.left, bounds.right),
        randomIntInRange(bounds.top, bounds.bottom),
    );
}

export function randomVectors(
    count: number,
    bounds: BoundingBox,
    minInterval: number = 0,
    maxInterval: number = 0,
    maxFailedAttempts: number = 50,
    unique: boolean = true,
): Vector[] {
    let findCb: false|((v1: Vector, v2: Vector) => boolean) = false;

    const checkMin = (v1: Vector, v2: Vector) => v1.distance(v2) < minInterval;
    const checkMax = (v1: Vector, v2: Vector) => v1.distance(v2) < maxInterval;

    if (minInterval && maxInterval) findCb = (v1, v2) => checkMin(v1, v2) && checkMax(v1, v2);
    else if (minInterval) findCb = checkMin;
    else if (maxInterval) findCb = checkMax;


    const uniquePoints = new Set();
    const points: Vector[] = [];

    let attempts = 0;
    while(!(maxFailedAttempts && attempts > maxFailedAttempts) && points.length < count) {
        const nextPoint = randomVector(bounds);
        attempts++;

        const stringKey = [nextPoint.x, nextPoint.y].join(',');

        if (
            (unique && uniquePoints.has(stringKey))
            || (findCb && points.find(p => findCb(p, nextPoint)))
        ) continue;

        attempts = 0;
        uniquePoints.add(stringKey);
        points.push(nextPoint);
    }

    return points;
}
