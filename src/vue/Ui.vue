<template>
    <div class="ui">
        <div class="ui__group">
            <span class="ui__fps">
                FPS:
                <span v-html="FPS"/>
            </span>
            <Toggle
                v-model="modelValue.blinkStars"
                label="Мерцание звёзд"
            />
            <Range
                v-model="modelValue.starsCount"
                label="Кол-во звёзд"
            />
            <Range
                v-model="modelValue.cometsInterval"
                label="Частота комет"
            />
            <Range
                v-model="modelValue.dustAmount"
                label="Кол-во пыли"
            />
            <ResetButton
                @click="resetState"
                label="Сбросить"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import Toggle from '@/vue/elements/Toggle.vue';
    import Range from '@/vue/elements/Range.vue';
    import {FPS, State, StateDefaults, StateProps} from '@/state';
    import ResetButton from '@/vue/elements/ResetButton.vue';

    const modelValue = defineModel<StateProps>({
        default: {
            blinkStars: true,
            starsCount: 1,
            cometsInterval: 1.0,
            dustAmount: 1.0,
        },
    });

    function resetState() {
        Object.assign(State, StateDefaults);
    }
</script>

<style lang="less">
    .ui {
        &__group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
    }
</style>