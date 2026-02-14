<template>
    <div class="root">
        <div
            class="root__ui-wrapper"
            :class="{ 'root__ui-wrapper--hidden': !uiVisible }"
        >
            <div
                class="root__ui-toggle"
                @click="uiVisible = !uiVisible"
            >
                <span
                    class="root__ui-toggle-icon"
                    :class="{ 'root__ui-toggle-icon--mirror': uiVisible }"
                    v-html="arrowSvg"
                />

            </div>
            <Ui class="root__ui" v-model="State"/>
        </div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
    import {Engine, EngineOptions} from 'excalibur';
    import {ref, toRaw, useTemplateRef, watch} from 'vue';
    import {Loader} from '@/resources';
    import Ui from '@/vue/Ui.vue';
    import arrowSvg from '/assets/icons/arrow.svg?raw';
    import {State} from '@/game/utils/state';

    const props = defineProps<{ config: EngineOptions }>();
    const canvas = useTemplateRef('canvas');

    const uiVisible = ref<boolean>(true);

    let game: Engine|undefined;

    watch(canvas, () => {
        game?.dispose();

        if (canvas.value) {
            game = new Engine({ ...toRaw(props.config), canvasElement: canvas.value });
            game.start('main', { loader: Loader });
        }
    });

</script>

<style lang="less">
    .root {
        --transit: cubic-bezier(.86,0,.07,1) .5s;

        position: relative;

        &__ui-wrapper {
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
        }

        &__ui-toggle {
            position: absolute;
            top: 0;
            right: -40px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            padding: 4px 8px;
            background: fade(black, 20);
        }

        &__ui-toggle-icon {
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
            pointer-events: none;

            & > * {
                pointer-events: auto;
            }
        }
    }
</style>