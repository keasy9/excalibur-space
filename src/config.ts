import {Color, DisplayMode, ImageFiltering} from 'excalibur';
import {Main} from "@/scenes/main";

const canvasElem = document.getElementById('canvas');
if (!canvasElem || !(canvasElem instanceof HTMLCanvasElement)) throw new Error('Canvas не найден!');

export const Config = {
    width: 512,
    height: 512,
    displayMode: DisplayMode.FillScreen,
    pixelArt: true,
    antialiasing: false,
    filtering: ImageFiltering.Pixel,
    pixelRatio: window.devicePixelRatio,
    backgroundColor: Color.Black,
    canvasElement: canvasElem,
    fixedUpdateFps: 60,
    scenes: {main: Main},
} as const;
