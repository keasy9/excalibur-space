import {reactive, watch} from 'vue';

export type StateProps = {
    blinkStars: boolean,
    starsCount: number,
    cometsInterval: number,
    dustAmount: number,
}

const storageValues = JSON.parse(localStorage.getItem('state') ?? '{}');

export const StateDefaults: StateProps = {
    blinkStars: true,
    starsCount: .8,
    cometsInterval: .5,
    dustAmount: .5,
};

export const State = reactive<StateProps>({
    blinkStars: storageValues.blinkStars ?? StateDefaults.blinkStars,
    starsCount: storageValues.starsCount ?? StateDefaults.starsCount,
    cometsInterval: storageValues.cometsInterval ?? StateDefaults.cometsInterval,
    dustAmount: storageValues.dustAmount ?? StateDefaults.dustAmount,
});

watch(State, () => {
    localStorage.setItem('state', JSON.stringify(State));
});
