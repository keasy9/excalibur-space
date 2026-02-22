<template>
    <label class="toggle">
        <span class="toggle__label" v-html="label"/>
        <input class="toggle__input" type="checkbox" v-model="modelValue">
        <span class="toggle__toggle"/>
    </label>
</template>

<script setup lang="ts">
    defineProps<{ label: string }>();
    const modelValue = defineModel<boolean>();
</script>

<style lang="less">
    .toggle {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 16px;
        cursor: pointer;

        &__input {
            display: none;
        }

        &__toggle {
            height: 16px;
            width: 36px;
            padding: 2px;
            background: lightpink;

            &:before {
                transition: all var(--transit);
                display: block;
                content: '';
                height: 100%;
                width: 50%;
                background: orangered;
                margin-left: 0;
            }
        }

        &__input:checked + &__toggle {
            &:before {
                margin-left: 50%;
                background: dodgerblue;
            }
        }
    }
</style>