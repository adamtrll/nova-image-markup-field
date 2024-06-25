import type Coordinate2D from './Coordinate2D'
import Drawable from './Drawable'

export default class Arrow extends Drawable {
    public startPoint: Coordinate2D
    public endPoint: Coordinate2D

    public color: string

    constructor(
        id: string,
        startPoint: Coordinate2D,
        endPoint: Coordinate2D,
        color: string
    ) {
        super(id, {}, false)

        this.startPoint = startPoint
        this.endPoint = endPoint
        this.color = color
    }
}
