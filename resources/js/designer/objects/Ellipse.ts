import type Coordinate2D from './Coordinate2D'
import Drawable from './Drawable'

export default class Ellipse extends Drawable {
    public center: Coordinate2D
    public radiusX: number
    public radiusY: number

    public color: string

    constructor(
        id: string,
        center: Coordinate2D,
        radiusX: number,
        radiusY: number,
        color: string
    ) {
        super(id, {}, false)

        this.center = center
        this.radiusX = radiusX
        this.radiusY = radiusY
        this.color = color
    }
}
