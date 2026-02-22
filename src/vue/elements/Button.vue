<template>
    <button class="button" type="button">
        <span class="button__label" v-html="label"/>
        <span v-if="icon" class="button__icon" v-html="icon"/>
    </button>
</template>

<script setup lang="ts">
    defineProps<{ label: string, icon?: string }>();
</script>

<style lang="less">
    .button {
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        color: inherit;
        font: inherit;
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;

        &__icon {
            svg {
                height: 32px;
                width: 32px;
                fill: currentColor;
            }
        }
    }
</style>