import type CanvasObject from "../objects/CanvasObject";
import type Arrow from "../objects/Arrow";

export default (arrow: Arrow): CanvasObject => {
    return {
        component: 'v-arrow',
        config: {
            id: arrow.id,
            x: arrow.startPoint.x,
            y: arrow.startPoint.y,
            points: [0, 0, arrow.endPoint.x - arrow.startPoint.x, arrow.endPoint.y - arrow.startPoint.y],
            pointerLength: 10,
            pointerWidth: 10,
            fill: arrow.color,
            stroke: arrow.color,
            strokeWidth: 6,
            ...arrow.drawConfig,
        },
        listeners: arrow.listeners,
        children: []
    }
}
