export default class Coordinate2D {
    public x
    public y
    public id

    /**
     *
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x: number, y: number, id = null) {
        this.x = x
        this.y = y
        this.id = id
    }
}
