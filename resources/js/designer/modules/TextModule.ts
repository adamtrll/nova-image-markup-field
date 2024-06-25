import { v4 } from 'uuid'
import Coordinate2D from '../objects/Coordinate2D'
import Text from '../objects/Text'
import DesignerModule from './DesignerModule'
import { getRelativePointerPosition } from '@/utils/draw'
import { MouseButton } from '@/utils/constants'

export default class TextModule extends DesignerModule {

    private _buttons = {}
    private _startPoint = new Coordinate2D(0, 0)

    // event handlers
    private _onStageClickHandler: any = null
    private _onDocumentKeyUpHandler: any  = null
    private _onDocumentKeyDownHandler: any  = null
    private _onTextInputHandler: any  = null

    private _stage;
    private _store;

    private _inputEl

    constructor(stage, store, _inputEl) {
        super()

        this._stage = stage
        this._store = store

        this._inputEl = _inputEl

        this._onStageClickHandler = this.onStageClick.bind(this)
        this._onDocumentKeyUpHandler = this.onDocumentKeyUp.bind(this)
        this._onDocumentKeyDownHandler = this.onDocumentKeyDown.bind(this)

        this._onTextInputHandler = this.onTextInput.bind(this)
    }

    turnOn() {
        this._stage.on('click', this._onStageClickHandler)

        document.addEventListener('keyup', this._onDocumentKeyUpHandler)
        document.addEventListener('keydown', this._onDocumentKeyDownHandler)

        this._inputEl.addEventListener('input', this._onTextInputHandler)
    }

    turnOff() {
        this._stage.off('click', this._onStageClickHandler)

        document.removeEventListener('keyup', this._onDocumentKeyUpHandler)
        document.removeEventListener('keydown', this._onDocumentKeyDownHandler)

        this._inputEl.removeEventListener('input', this._onTextInputHandler)

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

            const text = new Text(
                v4(),
                this._startPoint,
                "|",
                color
            )

            this._store.previewSet([text])

            this._inputEl.focus()
        } else {
            preview.forEach((text) => {
                if (text.text !== '|') {
                    text.text = this._inputEl.value
                    this._store.drawablePush(text)
                }
            })

            this.endDrawing()
        }
    }

    onDocumentKeyDown(e) {
        this._buttons[e.key] = true
    }

    onDocumentKeyUp(e) {
        if (['Escape', 'Delete'].includes(e.key)) {
            this.endDrawing()
        }

        this._buttons[e.key] = false
    }

    onTextInput(e) {
        const preview = this._store.preview
        if (preview.length !== 0) {

            const color = this._store.selectedColor

            const text = new Text(
                v4(),
                this._startPoint,
                e.target.value + '|',
                color
            )

            this._store.previewSet([text])
        }
    }

    endDrawing() {
        this._store.previewReset([])
        this._inputEl.value = ''
    }

}
