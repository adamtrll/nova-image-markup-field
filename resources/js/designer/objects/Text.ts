import type Coordinate2D from './Coordinate2D'
import Drawable from './Drawable'

export default class Text extends Drawable {
    public position: Coordinate2D
    public text: string

    public color: string

    constructor(
        id: string,
        position: Coordinate2D,
        text: string,
        color: string
    ) {
        super(id, {}, false)

        this.position = position
        this.text = text
        this.color = color
    }
}
