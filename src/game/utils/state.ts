import {reactive} from 'vue';

export type StateProps = {
    blinkStars: boolean,
    starsCount: number,
    cometsInterval: number,
}

export const State = reactive<StateProps>({
    blinkStars: true,
    starsCount: 1.0,
    cometsInterval: 1.0,
});
