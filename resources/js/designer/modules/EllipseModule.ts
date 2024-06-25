import { v4 } from 'uuid'
import Coordinate2D from '../objects/Coordinate2D'
import Ellipse from '../objects/Ellipse'
import DesignerModule from './DesignerModule'
import { getRelativePointerPosition } from '@/utils/draw'
import { MouseButton, CancelKeys } from '@/utils/constants'

export default class EllipseModule extends DesignerModule {

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

            const ellipse = new Ellipse(
                v4(),
                this._startPoint,
                0,
                0,
                color
            )

            this._store.previewSet([ellipse])
        } else {
            preview.forEach((ellipse) => {
                this._store.drawablePush(ellipse)
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

        const radiusX = (this._startPoint.x - pointer.x) / 2
        const radiusY = (this._startPoint.y - pointer.y) / 2

        const ellipse = new Ellipse(
            v4(),
            new Coordinate2D(this._startPoint.x - radiusX, this._startPoint.y - radiusY),
            Math.abs(radiusX),
            Math.abs(radiusY),
            color
        )

        this._store.previewSet([ellipse])
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
        this._store.previewReset()
    }

}
