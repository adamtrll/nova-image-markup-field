import type CanvasObject from "../objects/CanvasObject";
import type Ellipse from "../objects/Ellipse";

export default (ellipse: Ellipse): CanvasObject => {
    return {
        component: 'v-ellipse',
        config: {
            id: ellipse.id,
            x: ellipse.center.x,
            y: ellipse.center.y,
            radiusX: ellipse.radiusX,
            radiusY: ellipse.radiusY,
            stroke: ellipse.color,
            strokeWidth: 6,
            ...ellipse.drawConfig,
        },
        listeners: ellipse.listeners,
        children: []
    }
}
