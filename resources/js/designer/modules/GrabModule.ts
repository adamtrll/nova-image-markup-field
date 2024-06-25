import DesignerModule from './DesignerModule'
import { MouseButton } from '@/utils/constants'

export default class GrabModule extends DesignerModule {

    // event handlers
    private _onStageDragStartEvent: any = null;
    private _onStageDragEndEvent: any = null;
    private _onStageMouseDownEvent: any = null;
    private _onStageMouseUpEvent: any = null;

    private _stageRef;
    private _stage;
    private _store;

    constructor(stage, store, stageRef) {

        super()

        this._stage = stage
        this._store = store
        this._stageRef = stageRef

        this._onStageDragStartEvent = this.onStageDragStartEvent.bind(this)
        this._onStageDragEndEvent = this.onStageDragEndEvent.bind(this)
        this._onStageMouseDownEvent = this.onStageMouseDownEvent.bind(this)
        this._onStageMouseUpEvent = this.onStageMouseUpEvent.bind(this)

        this._stage.on('mousedown', this._onStageMouseDownEvent)
        this._stage.on('mouseup', this._onStageMouseUpEvent)
    }

    destruct() {
        this._stage.off('mousedown', this._onStageMouseDownEvent)
        this._stage.off('mouseup', this._onStageMouseUpEvent)
    }

    turnOn() {
        this._store.setStageConfig({
            ...this._store.stageConfig,
            draggable: true,
        })

        this._stage.on('dragstart', this._onStageDragStartEvent)
        this._stage.on('dragend', this._onStageDragEndEvent)

        this._stageRef.$el.style.cursor = 'grab'
    }

    turnOff() {
        this._store.setStageConfig({
            ...this._store.stageConfig,
            draggable: false,
        })

        this._stage.off('dragstart', this._onStageDragStartEvent)
        this._stage.off('dragend', this._onStageDragEndEvent)

        this._stageRef.$el.style.cursor = 'inherit'
    }

    onStageDragStartEvent() {
        this._stageRef.value.$el.style.cursor = 'grabbing'
    }

    onStageDragEndEvent() {
        this._stageRef.value.$el.style.cursor = 'grab'
    }

    onStageMouseDownEvent(e) {
        if (e.evt.button === MouseButton.Wheel) {
            this._store.setStageConfig({
                ...this._store.stageConfig,
                draggable: true,
            })
            this._stage.draggable(true)
            this._stageRef.value.$el.style.cursor = 'grabbing'
        }
    }

    onStageMouseUpEvent(e) {
        if (e.evt.button === MouseButton.Wheel) {
            this._store.setStageConfig({
                ...this._store.stageConfig,
                draggable: false,
            })
            this._stage.draggable(false)
            this._stageRef.value.$el.style.cursor = 'inherit'
        }
    }
}
