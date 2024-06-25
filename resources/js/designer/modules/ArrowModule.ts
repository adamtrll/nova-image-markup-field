import { v4 } from 'uuid'
import Coordinate2D from '../objects/Coordinate2D'
import Arrow from '../objects/Arrow'
import DesignerModule from './DesignerModule'
import { getRelativePointerPosition } from '@/utils/draw'
import { MouseButton, CancelKeys } from '@/utils/constants'

export default class ArrowModule extends DesignerModule {

    private _buttons = {}
    private _startPoint = new Coordinate2D(0, 0)

    // event handlers
    private _onStageClickHandler: any = null
    private _onstageMouseMoveHandler: any  = null
    private _onDocumentKeyUpHandler: any  = null
    private _onDocumentKeyDownHandler: any  = null

    private _stage;
    private _store;

    constructor(stage, store) {
        super()

        this._stage = stage
        this._store = store

        this._onStageClickHandler = this.onStageClick.bind(this)
        this._onstageMouseMoveHandler = this.onStageMouseMove.bind(this)
        this._onDocumentKeyUpHandler = this.onDocumentKeyUp.bind(this)
        this._onDocumentKeyDownHandler = this.onDocumentKeyDown.bind(this)
    }

    turnOn() {
        this._stage.on('click', this._onStageClickHandler)
        this._stage.on('mousemove', this._onstageMouseMoveHandler)

        document.addEventListener('keyup', this._onDocumentKeyUpHandler)
        document.addEventListener('keydown', this._onDocumentKeyDownHandler)
    }

    turnOff() {
        this._stage.off('click', this._onStageClickHandler)
        this._stage.off('mousemove', this._onstageMouseMoveHandler)

        document.removeEventListener('keyup', this._onDocumentKeyUpHandler)
        document.removeEventListener('keydown', this._onDocumentKeyDownHandler)

        this.endDrawing()
    }

    onStageClick(e) {
        if (e.evt.button === MouseButton.Secondary) {
            this.endDrawing()
            return
        }

        if (e.evt.button !== MouseButton.Main) {
            return
        }

        const pointer = getRelativePointerPosition(this._stage)
        const preview = this._store.preview
        if (preview.length === 0) {

            this._startPoint = new Coordinate2D(pointer.x, pointer.y)

            const color = this._store.selectedColor

            const arrow = new Arrow(
                v4(),
                this._startPoint,
                this._startPoint,
                color
            )

            this._store.previewSet([arrow])
        } else {
            preview.forEach((arrow) => {
                this._store.drawablePush(arrow)
            })

            this._store.previewReset()
        }
    }

    onStageMouseMove() {
        const preview = this._store.preview
        if (!preview.length) {
            return
        }

        const color = this._store.selectedColor
        const pointer = getRelativePointerPosition(this._stage)

        const endPoint = new Coordinate2D(pointer.x, pointer.y)

        const arrow = new Arrow(
            v4(),
            this._startPoint,
            endPoint,
            color
        )

        this._store.previewSet([arrow])
    }

    onDocumentKeyDown(e) {
        this._buttons[e.key] = true
    }

    onDocumentKeyUp(e) {
        if (CancelKeys.includes(e.key)) {
            this.endDrawing()
        }

        this._buttons[e.key] = false
    }

    endDrawing() {
        this._store.previewReset([])
    }

}
