import {reactive, ref, watch} from 'vue';

export type StateProps = {
    blinkStars: boolean,
    starsAmount: number,
    cometsInterval: number,
    dustAmount: number,
}

const storageValues = JSON.parse(localStorage.getItem('state') ?? '{}');

export const StateDefaults: StateProps = {
    blinkStars: true,
    starsAmount: .8,
    cometsInterval: .5,
    dustAmount: .5,
};

export const State = reactive<StateProps>({
    blinkStars: storageValues.blinkStars ?? StateDefaults.blinkStars,
    starsAmount: storageValues.starsCount ?? StateDefaults.starsAmount,
    cometsInterval: storageValues.cometsInterval ?? StateDefaults.cometsInterval,
    dustAmount: storageValues.dustAmount ?? StateDefaults.dustAmount,
});

export const FPS = ref<string|number>(0);

watch(State, () => {
    localStorage.setItem('state', JSON.stringify(State));
});
