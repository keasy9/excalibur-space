<template>
    <div class="range">
        <div class="range__label" v-html="label"/>
        <div
            class="range__range"
            :class="{ 'range__range--zero': (modelValue ?? 0) < 0.01 }"
            @pointerdown="onPointerDown"
            :style="{ '--progress': modelValue }"
            ref="track"
        />
    </div>
</template>

<script setup lang="ts">
    import {computed, onBeforeUnmount, onMounted, ref, useTemplateRef} from 'vue';
    import {clamp} from 'excalibur';

    defineProps<{ label: string }>();
    const modelValue = defineModel<number>();
    const pointerDown = ref<boolean>(false);
    const track = useTemplateRef<HTMLDivElement>('track');
    const trackRect = computed<DOMRect|undefined>(() => track.value?.getBoundingClientRect());

    function onPointerDown(event: PointerEvent) {
        if (!trackRect.value) return;

        modelValue.value = Math.round(((event.clientX - trackRect.value.x) / trackRect.value.width) * 100) / 100;

        pointerDown.value = true;
    }

    function onPointerMove(event: PointerEvent) {
        if (!(pointerDown.value && trackRect.value)) return;
        modelValue.value = clamp(
            Math.round(((event.clientX - trackRect.value.x) / trackRect.value.width) * 100) / 100,
            0,
            1,
        );
    }

    function onPointerUp() {
        pointerDown.value = false
    }

    onMounted(() => {
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointermove', onPointerMove);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointermove', onPointerMove);
    });
</script>

<style lang="less">
    .range {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        overflow: hidden;

        &__range {
            position: relative;
            min-width: 150px;
            align-self: stretch;
            display: flex;
            align-items: center;
            cursor: pointer;

            &:before {
                display: block;
                content: '';
                width: 100%;
                height: 4px;
                background: lightpink;
            }

            &:after {
                display: block;
                content: '';
                transition: all ease .05s;
                left: calc(var(--progress, 0) * 100% - var(--progress, 0) * 4px);
                position: absolute;
                width: 4px;
                top: -6px;
                bottom: -6px;
                background: dodgerblue;
            }

            &--zero {
                &:after {
                    background: orangered;
                }
            }
        }
    }
</style>