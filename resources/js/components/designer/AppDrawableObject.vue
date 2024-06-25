<script setup lang="ts">
import { computed } from "vue";

import type Drawable from "@/designer/objects/Drawable";
import AppCanvasObject from "./AppCanvasObject.vue";

import EllipseMapper from "@/designer/mappers/EllipseMapper";
import ArrowMapper from "@/designer/mappers/ArrowMapper";
import TextMapper from "@/designer/mappers/TextMapper";

const mappers = {
    Ellipse: EllipseMapper,
    Arrow: ArrowMapper,
    Text: TextMapper,
};

interface Props {
    drawable: Drawable;
}

const props = defineProps<Props>();

const canvasObject = computed(() =>
    mappers[props.drawable.type](props.drawable)
);
</script>

<template>
    <app-canvas-object
        v-if="canvasObject !== null"
        :canvas-object="canvasObject"
    />
</template>
