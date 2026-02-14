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
        </div>
    </div>
</template>

<script setup lang="ts">
    import Toggle from '@/vue/inputs/Toggle.vue';
    import Range from '@/vue/inputs/Range.vue';

    const props = defineProps<{
        //
    }>();

    const modelValue = defineModel<{
        blinkStars: boolean,
        starsCount: number,
    }>({
        default: {
            blinkStars: true,
            starsCount: 1,
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