import {Color as ExcaliburColor, lerp} from 'excalibur';
import {roundToPrecision} from '@/game/utils/math';

// todo заменить на класс Excalibur после 0.33.0
export class Color extends ExcaliburColor {
    /**
     * Return linear representation of a color component
     * @param c color component
     * @param scale color gamma, 2.2 recommended as standard
     */
    private static _COMPONENT_TO_LINEAR(c: number, scale: number = 2.2) {
        return Math.pow(c, scale);
    }

    /**
     * Return color component from its linear representation
     * @param c color component
     * @param scale color gamma, 2.2 recommended as standard
     * @private
     */
    private static _COMPONENT_FROM_LINEAR(c: number, scale: number = 2.2) {
        return Math.pow(c, 1.0 / scale);
    }

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

    /**
     * Lerp between two colors different modes:
     * - hsl (default) - a compromise between speed and naturalness of the gradient, suitable for most cases;
     * - rgb - the fastest algorithm, but worse results for complex gradients;
     * - lrgb - the most realistic result, but slower than the others.
     */
    public static lerp(colorA: Color, colorB: Color, t: number, colorSpace: 'hsl' | 'rgb' | 'lrgb' = 'hsl'): Color {
        switch (colorSpace) {
            case 'hsl':
                return Color.lerpHSL(colorA, colorB, t);
            case 'rgb':
                return Color.lerpRGB(colorA, colorB, t);
            case 'lrgb':
                return Color.lerpLRGB(colorA, colorB, t);
        }
    }

    /**
     * Lerp between two colors using hsl as a compromise between speed and naturalness of the gradient
     */
    public static lerpHSL(colorA: Color, colorB: Color, t: number): Color {
        return super.lerp(colorA, colorB, t) as Color;
    }

    /**
     * Lerp between two colors using rgb for faster calculations
     */
    public static lerpRGB(colorA: Color, colorB: Color, t: number): Color {
        return new Color(lerp(colorA.r, colorB.r, t), lerp(colorA.g, colorB.g, t), lerp(colorA.b, colorB.b, t), lerp(colorA.a, colorB.a, t));
    }

    /**
     * Lerp between two colors using lrgb for more realistic gradient
     */
    public static lerpLRGB(colorA: Color, colorB: Color, t: number, gamma: number = 2.2): Color {
        const rA = Color._COMPONENT_TO_LINEAR(colorA.r, gamma);
        const gA = Color._COMPONENT_TO_LINEAR(colorA.g, gamma);
        const bA = Color._COMPONENT_TO_LINEAR(colorA.b, gamma);

        const rB = Color._COMPONENT_TO_LINEAR(colorB.r, gamma);
        const gB = Color._COMPONENT_TO_LINEAR(colorB.g, gamma);
        const bB = Color._COMPONENT_TO_LINEAR(colorB.b, gamma);

        const rL = lerp(rA, rB, t);
        const gL = lerp(gA, gB, t);
        const bL = lerp(bA, bB, t);

        return new Color(
            Color._COMPONENT_FROM_LINEAR(rL, gamma),
            Color._COMPONENT_FROM_LINEAR(gL, gamma),
            Color._COMPONENT_FROM_LINEAR(bL, gamma),
            lerp(colorA.a, colorB.a, t) // keeping alpha linear
        );
    }
}
