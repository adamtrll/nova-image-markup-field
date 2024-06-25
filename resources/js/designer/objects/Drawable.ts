import type CanvasObject from "./CanvasObject"

export default abstract class Drawable {
    public type: string
    public id: string
    public selected: boolean
    public drawConfig: Object
    public listeners: Record<string, void>

   constructor(id: string, drawConfig: Object = {}, selected: boolean = false) {
        this.id = id
        this.drawConfig = drawConfig
        this.selected = selected
        this.listeners = {}

        this.type = this.constructor.name
    }
}
