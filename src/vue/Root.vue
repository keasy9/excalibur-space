<template>
    <div
        class="ui-wrapper"
        :class="{ 'ui-wrapper--hidden': !uiVisible }"
    >
        <div
            class="ui-wrapper__toggle"
            @click="uiVisible = !uiVisible"
        >
            <span
                class="ui-wrapper__toggle-icon"
                :class="{ 'ui-wrapper__toggle-icon--mirror': uiVisible }"
                v-html="arrowSvg"
            />

        </div>
        <Ui class="ui-wrapper__ui" v-model="State"/>
    </div>
</template>

<script setup lang="ts">
    import {ref} from 'vue';
    import Ui from '@/vue/Ui.vue';
    import arrowSvg from '/assets/icons/arrow.svg?raw';
    import {State} from '@/game/utils/state';

    const uiVisible = ref<boolean>(true);

</script>

<style lang="less">
    .ui-wrapper {
        --transit: cubic-bezier(.86,0,.07,1) .5s;

        pointer-events: none;
        transition: transform var(--transit);
        position: absolute;
        top: 0;
        left: 0;
        padding: 8px;
        background: fade(black, 20);
        color: lightpink;

        &--hidden {
            transform: translateX(-100%);
        }

        &__toggle {
            pointer-events: auto;
            position: absolute;
            top: 0;
            right: -40px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            padding: 4px 8px;
            background: fade(black, 20);
        }

        &__toggle-icon {
            width: 100%;
            height: 100%;
            display: block;
            transition: transform var(--transit);
            fill: lightpink;

            &--mirror {
                transform: scaleX(-1);
            }
        }

        &__ui {

            & > * {
                pointer-events: auto;
            }
        }
    }
</style>