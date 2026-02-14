import {ImageSource, Loader as DefaultLoader} from 'excalibur';


export const Resources = {
    SpriteStars: new ImageSource('./assets/sprites/stars.png'),
} as const;

export const Loader = new DefaultLoader(Object.values(Resources));
