<script setup lang="ts">
import { useDesignerStore } from "@/store";
import { computed, ref } from "vue";
import { clamp } from "@/utils/math";
import type ZoomModule from "@/designer/modules/ZoomModule";
import { ZoomIn, ZoomOut, ScanSearch } from "lucide-vue-next";

const minZoom = ref(1);
const maxZoom = ref(10);
const zoomingScale = 0.4;

const store = useDesignerStore();

const zoom = computed({
    get: () => store.stageConfig.scale.x,
    set: (val) => {
        setZoom(Number(val));
    },
});

const zoomModule = computed<ZoomModule | null>(
    () => (store.modules["ZoomModule"] as ZoomModule) || null
);

const zoomIn = () => {
    setZoom(zoom.value + zoomingScale);
};

const zoomOut = () => {
    setZoom(zoom.value - zoomingScale);
};

const resetZoom = () => {
    zoomModule.value?.resetZoom();
};

const setZoom = (z) => {
    const clampedZoom = clamp(minZoom.value, maxZoom.value, z);

    zoomModule.value?.setScale(clampedZoom);
};
</script>

<template>
    <div class="flex space-x-1">
        <button
            class="btn btn-secondary btn-icon"
            @click.prevent="zoomOut"
            type="button"
        >
            <ZoomOut />
        </button>
        <input
            v-model="zoom"
            type="range"
            id="volume"
            name="volume"
            :min="minZoom"
            :max="maxZoom"
            :step="0.1"
        />
        <button
            class="btn btn-secondary btn-icon"
            @click.prevent="zoomIn"
            type="button"
        >
            <ZoomIn />
        </button>

        <button
            class="btn btn-secondary btn-icon"
            @click.prevent="resetZoom"
            type="button"
        >
            <ScanSearch />
        </button>
    </div>
</template>
