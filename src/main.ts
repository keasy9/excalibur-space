import {createApp} from 'vue';
import Root from './vue/Root.vue';
import {Engine} from 'excalibur';
import {Config} from '@/game/config';
import {Loader} from '@/game/resources';

createApp(Root).mount('#root');


const game = new Engine({ ...Config, canvasElementId: 'canvas'});

game.start(Loader).then(() => game.goToScene('main'));


