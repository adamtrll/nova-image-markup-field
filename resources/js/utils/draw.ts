export const getRelativePointerPosition = (node) => {
    const transform = node.getAbsoluteTransform().copy()
    transform.invert()

    const pos = node.getStage().getPointerPosition()

    return transform.point(pos)
}
