<script setup lang="ts">
import type CanvasObject from "@/designer/objects/CanvasObject";

interface Props {
    canvasObject: CanvasObject;
}

const props = defineProps<Props>();
</script>

<template>
    <component
        :is="props.canvasObject.component"
        :config="props.canvasObject.config"
        v-on="props.canvasObject.listeners"
    >
        <app-canvas-object
            v-for="child in props.canvasObject.children"
            :key="child.config.id"
            :canvas-object="child"
        />
    </component>
</template>
