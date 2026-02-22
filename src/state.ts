import {reactive, watch} from 'vue';

export type StateProps = {
    blinkStars: boolean,
    starsCount: number,
    cometsInterval: number,
    dustAmount: number,
}

const storageValues = JSON.parse(localStorage.getItem('state') ?? '{}');

export const State = reactive<StateProps>({
    blinkStars: storageValues.blinkStars ?? true,
    starsCount: storageValues.starsCount ?? .8,
    cometsInterval: storageValues.cometsInterval ?? .5,
    dustAmount: storageValues.dustAmount ?? .5,
});

watch(State, () => {
    localStorage.setItem('state', JSON.stringify(State));
});
