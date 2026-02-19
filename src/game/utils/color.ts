import {Color as ExcaliburColor} from 'excalibur';
import {roundToPrecision} from '@/game/utils/math';

export class Color extends ExcaliburColor {
    public static fromFloat(r: number, g: number, b: number, a: number): Color {
        return new Color(r * 255, g * 255, b * 255, a);
    }

    public static fromHex(hex: string): Color {
        const exColor = super.fromHex(hex);
        return new Color(exColor.r, exColor.g, exColor.b, exColor.a);
    }

    public static fromHSL(h: number, s: number, l: number, a?: number): Color {
        const exColor = super.fromHSL(h, s, l, a);
        return new Color(exColor.r, exColor.g, exColor.b, exColor.a);
    }

    public static fromRGBString(string: string): Color {
        const exColor = super.fromRGBString(string);
        return new Color(exColor.r, exColor.g, exColor.b, exColor.a);
    }

    public static fromRGB(r: number, g: number, b: number, a?: number): ExcaliburColor {
        const exColor = super.fromRGB(r, g, b, a);
        return new Color(exColor.r, exColor.g, exColor.b, exColor.a);
    }

    public toFloat(precision: number = 2): [number, number, number, number] {
        return [
            roundToPrecision(this.r / 255, precision),
            roundToPrecision(this.g / 255, precision),
            roundToPrecision(this.b / 255, precision),
            this.a,
        ];
    }
}
