<template>
    <div class="ui">
        <div class="ui__group">
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
                label="Кол-во туманностей"
            />
            <Button
                @click="resetState"
                label="Сбросить"
                :icon="resetSvg"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import Toggle from '@/vue/elements/Toggle.vue';
    import Range from '@/vue/elements/Range.vue';
    import {State, StateDefaults, StateProps} from '@/state';
    import Button from '@/vue/elements/Button.vue';
    import resetSvg from '/assets/icons/reset.svg?raw';

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
