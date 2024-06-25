<script setup lang="ts">
import {
    TextCursorInput,
    Hand,
    MousePointer2,
    Radius,
    MoveUpRight,
    Trash2,
} from "lucide-vue-next";
import { useDesignerStore } from "@/store";
import { computed } from "vue";

import AppDesignerZoomInput from "./AppDesignerZoomInput.vue";
import type DeleteModule from "@/designer/modules/DeleteModule";

const store = useDesignerStore();

const actions = [
    {
        id: "SelectModule",
        title: "Select",
        icon: MousePointer2,
    },
    {
        id: "GrabModule",
        title: "Grab",
        icon: Hand,
    },
];

const objects = [
    {
        id: "EllipseModule",
        title: "Ellipse",
        icon: Radius,
    },
    {
        id: "ArrowModule",
        title: "Arrow",
        icon: MoveUpRight,
    },
    {
        id: "TextModule",
        title: "Text",
        icon: TextCursorInput,
    },
];

const actionButtons = computed(() =>
    actions.map((a) => ({
        id: a.id,
        selected: store.activeModuleIds.includes(a.id),
        title: a.title,
        icon: a.icon,
    }))
);

const objectButtons = computed(() =>
    objects.map((a) => ({
        id: a.id,
        selected: store.activeModuleIds.includes(a.id),
        title: a.title,
        icon: a.icon,
    }))
);

const selectModule = (id) => {
    store.selectModules([id]);
};

const drawColor = computed({
    get: () => store.selectedColor,
    set: (val) => store.setSelectedColor(val),
});

const deleteModule = computed<DeleteModule | null>(
    () => (store.modules["DeleteModule"] as DeleteModule) || null
);

const deleteSelected = () => {
    deleteModule.value?.deleteSelected();
};
</script>

<template>
    <div class="flex mt-12 mb-4">
        <div class="flex space-x-1">
            <button
                class="btn btn-icon"
                :class="[btn.selected ? 'btn-primary' : 'btn-secondary']"
                v-for="btn in actionButtons"
                :key="btn.id"
                @click.prevent="selectModule(btn.id)"
            >
                <component :is="btn.icon" />
            </button>
        </div>
        <div class="ml-6 flex space-x-1">
            <button
                class="btn btn-icon"
                :class="[btn.selected ? 'btn-primary' : 'btn-secondary']"
                v-for="btn in objectButtons"
                :key="btn.id"
                @click.prevent="selectModule(btn.id)"
            >
                <component :is="btn.icon" />
            </button>
        </div>
        <div class="ml-4">
            <input
                class="btn btn-secondary w-16"
                type="color"
                name="canvas-color"
                v-model="drawColor"
            />
        </div>
        <div v-if="store.selectedDrawables.length > 0" class="ml-6">
            <button
                class="btn btn-icon btn-destructive"
                @click.prevent="deleteSelected"
            >
                <Trash2 />
            </button>
        </div>
        <div class="ml-auto">
            <AppDesignerZoomInput />
        </div>
    </div>
</template>

<style scoped>
.active {
    border: 1px solid blue;
}
</style>
