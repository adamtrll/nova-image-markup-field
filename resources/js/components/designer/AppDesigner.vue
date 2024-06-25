<script setup lang="ts">
import { useDesignerStore } from '@/store'
import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    watch,
    defineEmits,
    nextTick,
} from 'vue'
import AppDesignerToolbar from './toolbar/AppDesignerToolbar.vue'
import AppDrawableObject from './AppDrawableObject.vue'
import GrabModule from '@/designer/modules/GrabModule'
import ZoomModule from '@/designer/modules/ZoomModule'
import EllipseModule from '@/designer/modules/EllipseModule'
import ArrowModule from '@/designer/modules/ArrowModule'
import SelectModule from '@/designer/modules/SelectModule'
import DeleteModule from '@/designer/modules/DeleteModule'
import TextModule from '@/designer/modules/TextModule'

interface Props {
    bgUrl: string
}

const emit = defineEmits(['save'])
const props = defineProps<Props>()
const store = useDesignerStore()

const editing = ref(false)

const container = ref()
const stageRef = ref()
const transformer = ref()
const text = ref()

const bg = ref<HTMLImageElement | null>(null)

const canvasSize = ref<{ width: number; height: number }>({
    width: 0,
    height: 0,
})

const img = new window.Image()
img.src = props.bgUrl

img.onload = () => {
    bg.value = img
}

watch(bg, () => {
    saveContainerSize()
})

const saveContainerSize = () => {
    const containerWidth = container.value?.clientWidth
    let aspectRatio = 0.5

    if (bg.value !== null) {
        if (bg.value.width > bg.value.height) {
            aspectRatio = bg.value.height / bg.value.width
        } else {
            aspectRatio = bg.value.width / bg.value.height
        }
    }

    canvasSize.value = {
        width: containerWidth,
        height: containerWidth * aspectRatio,
    }

    store.setStageConfig({
        ...store.stageConfig,
        width: canvasSize.value.width,
        height: canvasSize.value.height,
    })
}

onMounted(() => {
    saveContainerSize()

    const stage = stageRef.value.getStage()

    const transformerNode = transformer.value.getNode()

    store.registerModules([
        new ZoomModule(stage, store, stageRef),
        new GrabModule(stage, store, stageRef),
        new SelectModule(stage, store, transformerNode),
        new EllipseModule(stage, store),
        new ArrowModule(stage, store),
        new DeleteModule(store, transformerNode),
        new TextModule(stage, store, text.value),
    ])

    store.selectModules(['SelectModule'])

    window.addEventListener('resize', () => {
        saveContainerSize()
    })

    dark.value = document.documentElement.classList.contains('dark')

    observer.value = new MutationObserver((records) => {
        records.forEach((record) => {
            if (record.target instanceof HTMLElement) {
                dark.value = (record.target as HTMLElement).classList.contains(
                    'dark'
                )
            }
        })
    })

    observer.value.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false,
    })
})

const zoomModule = computed<ZoomModule | null>(
    () => (store.modules['ZoomModule'] as ZoomModule) || null
)

const save = async () => {
    zoomModule.value?.resetZoom()

    // making sure that the zoom changes take place before saving the image
    await nextTick()

    let dataURL = stageRef.value.getStage().toDataURL({
        pixelRatio: bg.value!.width / container.value?.clientWidth,
    })

    emit('save', dataURL)

    editing.value = false
}

const observer = ref<MutationObserver | null>(null)
const dark = ref(false)

onBeforeUnmount(() => {
    observer.value?.disconnect()
    observer.value = null
})
</script>

<template>
    <div class="image-markup">
        <div ref="container" class="pt-6">
            <div v-if="!editing">
                <button class="btn btn-primary" @click.prevent="editing = true">
                    Edit image
                </button>
            </div>
            <div v-show="editing">
                <div
                    class="flex flex-col md:flex-row md:items-center justify-center md:justify-end space-y-2 md:space-y-0 md:space-x-3"
                >
                    <button
                        class="btn btn-text"
                        @click.prevent="editing = false"
                    >
                        Cancel
                    </button>
                    <button class="btn btn-primary" @click.prevent="save">
                        Apply edits
                    </button>
                </div>
                <AppDesignerToolbar />
                <textarea
                    class="size-0 opacity-0 absolute pointer-events-none"
                    ref="text"
                ></textarea>
                <div class="border border-gray-200 dark:border-gray-700">
                    <v-stage ref="stageRef" :config="store.stageConfig">
                        <v-layer>
                            <v-image
                                id="background"
                                :config="{
                                    image: bg,
                                    width: canvasSize.width,
                                    height: canvasSize.height,
                                }"
                            />
                        </v-layer>
                        <v-layer id="drawables">
                            <AppDrawableObject
                                v-for="drawable in store.drawables"
                                :key="drawable.id"
                                :drawable="drawable"
                            ></AppDrawableObject>

                            <v-transformer
                                ref="transformer"
                                :config="{
                                    ignoreStroke: true,
                                    enabledAnchors: [
                                        'top-left',
                                        'top-right',
                                        'bottom-left',
                                        'bottom-right',
                                    ],
                                }"
                            />
                        </v-layer>
                        <v-layer id="preview" :config="{ opacity: 0.6 }">
                            <AppDrawableObject
                                v-for="drawable in store.preview"
                                :key="drawable.id"
                                :drawable="drawable"
                            ></AppDrawableObject>
                        </v-layer>
                    </v-stage>
                </div>
            </div>
        </div>
    </div>
</template>
