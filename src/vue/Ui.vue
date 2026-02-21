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
        </div>
    </div>
</template>

<script setup lang="ts">
    import Toggle from '@/vue/inputs/Toggle.vue';
    import Range from '@/vue/inputs/Range.vue';
    import {StateProps} from '@/game/utils/state';

    const modelValue = defineModel<StateProps>({
        default: {
            blinkStars: true,
            starsCount: 1,
            cometsInterval: 1.0,
        },
    });
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