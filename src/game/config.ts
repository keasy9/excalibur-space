import {Color, DisplayMode} from 'excalibur';
import {Main} from '@/game/scenes/main';

export const Config = {
    width: 512,
    height: 512,
    displayMode: DisplayMode.FitScreenAndFill,
    pixelArt: true,
    antialiasing: false,
    pixelRatio: window.devicePixelRatio,
    backgroundColor: Color.Black,
    fixedUpdateFps: 60,
    scenes: {main: Main},
    suppressConsoleBootMessage: false, // демонстрационный проект, поэтому намеренно всегда показываем
    suppressPlayButton: true,
} as const;
