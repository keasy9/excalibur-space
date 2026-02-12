import {createApp} from 'vue';
import Root from '@/vue/Root.vue';
import {Config} from '@/game/config';

createApp(Root, { config: Config }).mount('#root');
