<template>
    <Button
        :label="label"
        class="reset-button"
        :class="{ 'reset-button--clicked': justClicked }"
        @click="justClicked = true"
    >
        <template #icon>
            <span
                class="reset-button__icon"
                v-html="resetSvg"
                @transitionend="justClicked = false"
            />
        </template>
    </Button>
</template>

<script setup lang="ts">
    import resetSvg from '/assets/icons/reset.svg?raw';
    import Button from '@/vue/elements/Button.vue';
    import {ref} from 'vue';

    defineProps<{ label: string }>();

    const justClicked = ref<boolean>(false);
</script>

<style lang="less">
    .reset-button {
        &:hover {
            color: orangered;
        }

        &__icon {
            transform: rotate(0deg);
        }

        &--clicked {
            .reset-button__icon {
                transition: transform var(--transit);
                transform: rotate(360deg);
            }
        }
    }
</style>