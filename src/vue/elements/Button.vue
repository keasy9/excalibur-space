<template>
    <button class="button" type="button">
        <span class="button__label" v-html="label"/>
        <slot name="icon">
            <span v-if="icon" class="button__icon" v-html="icon"/>
        </slot>
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
        transition: color ease .2s;

        &:hover {
            color: dodgerblue;
        }

        svg {
            height: 32px;
            width: 32px;
            fill: currentColor;
        }
    }
</style>