import type CanvasObject from "../objects/CanvasObject";
import type Text from "../objects/Text";

export default (text: Text): CanvasObject => {
    return {
        component: 'v-text',
        config: {
            id: text.id,
            x: text.position.x,
            y: text.position.y,
            text: text.text,
            fontFamily: 'Arial',
            fontSize: 18,
            fill: text.color,
            ...text.drawConfig,
        },
        listeners: text.listeners,
        children: []
    }
}
