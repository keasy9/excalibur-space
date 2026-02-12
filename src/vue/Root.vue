<template>
    <div>
        <div class="ui">

        </div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
    import {Engine, EngineOptions} from 'excalibur';
    import {toRaw, useTemplateRef, watch} from 'vue';

    const props = defineProps<{
        config: EngineOptions
    }>();
    const canvas = useTemplateRef('canvas');

    let game: Engine|undefined;

    watch(canvas, () => {
        game?.dispose();

        if (canvas.value) {
            game = new Engine({ ...toRaw(props.config), canvasElement: canvas.value });
            game.start('main');
        }
    });
</script>

<style lang="less">
    .ui {
        pointer-events: none;

        & > * {
            pointer-events: auto;
        }
    }
</style>