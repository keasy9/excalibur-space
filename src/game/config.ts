import {Color, DisplayMode, ImageFiltering} from 'excalibur';
import {Main} from "@/game/scenes/main";
import {isProd} from '@/game/utils/env';

export const Config = {
    width: 512,
    height: 512,
    displayMode: DisplayMode.FillScreen,
    pixelArt: true,
    antialiasing: false,
    filtering: ImageFiltering.Pixel,
    pixelRatio: window.devicePixelRatio,
    backgroundColor: Color.Black,
    fixedUpdateFps: 60,
    scenes: {main: Main},
    suppressConsoleBootMessage: isProd(),
} as const;
