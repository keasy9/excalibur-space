export type Environment = 'dev' | 'prod';

export function isDebug(): boolean {
    return import.meta.env.DEV ?? false;
}

export function isProd(): boolean {
    return !isDebug();
}
