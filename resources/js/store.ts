import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import type Drawable from "@/designer/objects/Drawable";
import type DesignerModule from "@/designer/modules/DesignerModule";

export const useDesignerStore = defineStore("designer", () => {
    const stageConfig = ref({
        scale: {
            x: 1,
            y: 1,
        },
        position: {
            x: 0,
            y: 0,
        },
        width: 200,
        height: 200,
    });

    const transformerConfig = ref({
        resizeEnabled: false,
        rotateEnabled: false,
    });

    const modules = ref<Record<string, DesignerModule>>({});

    const activeModuleIds = ref<string[]>([]);

    const selectedColor = ref("#ff0000");

    const drawables = ref<Drawable[]>([]);

    const preview = ref<Drawable[]>([]);

    const activeModules = computed(() =>
        activeModuleIds.value.map((id) => modules.value[id])
    );

    const selectedDrawables = computed(() =>
        drawables.value.filter((item) => item.selected)
    );

    const setSelectedColor = (color) => {
        selectedColor.value = color
    }

    const setStageConfig = (config) => {
        stageConfig.value = config
    }

    const selectModules = (moduleIds) => {
        // turning off current active modules
        activeModules.value.forEach((m) => {
            m?.turnOff?.();
        });

        activeModuleIds.value = moduleIds;

        // turning on new active modules
        activeModules.value.forEach((m) => {
            m?.turnOn?.();
        });
    };

    const registerModules = (newModules) => {
        for (const m of newModules) {
            modules.value[m.constructor.name] = m;
        }
    };

    const previewSet = (newPreview) => {
        preview.value = newPreview
    }

    const previewPush = (drawable) => {
        preview.value.push(drawable);
    };

    const previewPop = () => {
        preview.value.pop();
    };

    const previewReset = () => {
        preview.value = []
    }

    const previewItemUpdate = (drawable) => {
        const idx = preview.value.findIndex((d) => d.id === drawable.id);

        if (idx !== -1) {
            preview.value[idx] = drawable;
        }
    };

    const previewItemDeleteById = (id) => {
        const idx = preview.value.findIndex((d) => d.id === id);

        if (idx !== -1) {
            preview.value.splice(idx, 1);
        }
    };

    const drawablePush = (drawable) => {
        drawables.value.push(drawable);
    };

    const drawablePop = () => {
        drawables.value.pop();
    };

    const drawableItemUpdate = (drawable) => {
        const idx = drawables.value.findIndex((d) => d.id === drawable.id);

        if (idx !== -1) {
            drawables.value.splice(idx, 1, drawable);
        }
    };

    const drawableItemDeleteById = (id) => {
        const idx = drawables.value.findIndex((d) => d.id === id);

        if (idx !== -1) {
            drawables.value.splice(idx, 1);
        }
    };

    return {
        stageConfig,
        transformerConfig,
        modules,
        activeModuleIds,
        selectedColor,
        drawables,
        preview,

        activeModules,

        setSelectedColor,

        selectedDrawables,
        selectModules,
        registerModules,
        previewPush,

        setStageConfig,

        previewSet,
        previewPop,
        previewItemUpdate,
        previewItemDeleteById,
        previewReset,
        // previewItemDeleteByClassName,

        drawablePush,
        drawablePop,
        drawableItemUpdate,
        drawableItemDeleteById,
    };
});
