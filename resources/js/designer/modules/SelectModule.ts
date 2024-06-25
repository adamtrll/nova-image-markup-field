import DesignerModule from './DesignerModule'
import { MouseButton } from '@/utils/constants'

export default class SelectModule extends DesignerModule {

    private _stage: any;
    private _store: any;

    private _transformerNode: any;

    private _onStageMouseDownHandler: any = null


    constructor(stage, store, transformerNode) {

        super()

        this._stage = stage
        this._store = store
        this._transformerNode = transformerNode

        this._onStageMouseDownHandler = this.handleStageMouseDown.bind(this)
    }

    turnOn() {
        this._stage.on('mousedown', this._onStageMouseDownHandler)

        const drawables = this._store.drawables

        drawables.forEach((d) => {

            d.drawConfig.draggable = true

            d.listeners.click = (e) => this.handleDrawableClick(e)
            d.listeners.dragEnd = (e) => this.handleDrawableDragEnd(e)
            d.listeners.transformend = (e) => this.handleDrawableTransformEnd(e)

            this._store.drawableItemUpdate(d)
        })
    }

    turnOff() {
        this.resetSelection()

        this._stage.off('mousedown', this._onStageMouseDownHandler)

        const drawables = this._store.drawables

        drawables.forEach((d) => {
            d.drawConfig.draggable = false

            d.listeners.click = null
            d.listeners.dragEnd = null
            d.listeners.transformend = null

            this._store.drawableItemUpdate(d)
        })
    }

    handleStageMouseDown(e) {
        if (e.evt.button !== MouseButton.Main) {
            return
        }

        if (e.target === this._stage || e.target.attrs.id === 'background') {
            this.resetSelection()
        }
    }

    handleDrawableClick(e) {
        if (e.evt.button !== MouseButton.Main) {
            return
        }

        const targetId = e.currentTarget.attrs.id

        const drawable = this._store.drawables.find((d) => d.id === targetId)
        this.selectDrawable(drawable)

        this.updateTransformer()
    }

    handleDrawableTransformEnd(e) {
        const d = this._store.selectedDrawables.find(d => d.id === e.target.attrs.id)

        if (d) {
            d.drawConfig.x = e.target.x();
            d.drawConfig.y = e.target.y();
            d.drawConfig.rotation = e.target.rotation();
            d.drawConfig.scaleX = e.target.scaleX();
            d.drawConfig.scaleY = e.target.scaleY();

            this._store.drawableItemUpdate(d)
        }
    }

    handleDrawableDragEnd(e) {
        const d = this._store.selectedDrawables.find(d => d.id === e.target.attrs.id)

        if (d) {
            d.drawConfig.x = e.target.x();
            d.drawConfig.y = e.target.y();

            this._store.drawableItemUpdate(d)
        }
    }

    selectDrawable(drawable) {
        drawable.selected = true

        this._store.drawableItemUpdate(drawable)
    }

    resetSelection() {
        const drawables = this._store.selectedDrawables
        drawables.forEach((d) => {
            if (d.selected) {
                d.selected = false

                this._store.drawableItemUpdate(d)
            }
        })

        this.updateTransformer()
    }

    updateTransformer() {
        const selectedObjects = this._store.selectedDrawables

        const selectedNodes = selectedObjects.map((d) => this._stage.findOne(`#${d.id}`))

        this._transformerNode.nodes(selectedNodes)
    }
}
