export default interface CanvasObject {
    component: string
    config: any // todo: konva config
    children: CanvasObject[]
    listeners: Record<string, void> // todo
}
