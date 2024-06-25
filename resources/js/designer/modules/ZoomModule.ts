import { roundNumber, clamp } from "@/utils/math";
import DesignerModule from "./DesignerModule";

const ScaleSettings = {
    scaleBy: 1.05,
    minScale: 1,
    maxScale: 10,
};

export default class ZoomModule extends DesignerModule {

    private _stageRef;
    private _stage;
    private _store;

    private _scrolling = 0;
    private _cursor = "inherit";

    public buttons = {};

    // event handlers
    private _onStageWheelHandler: any = null;

    constructor(stage, store, stageRef) {

        super();

        this._stage = stage;
        this._store = store;
        this._stageRef = stageRef;

        this._onStageWheelHandler = this.onStageWheel.bind(this);
        this._stage.addEventListener("wheel", this._onStageWheelHandler);
    }

    destruct() {
        this._stage.removeEventListener("wheel", this._onStageWheelHandler);
    }

    onStageWheel(e) {
        try {
            e.preventDefault();

            if (this._scrolling === 0) {
                this._cursor = this._stageRef.value.$el.style.cursor;
            }

            this._scrolling++;

            let newScale : number | null = null;

            const oldScale = this._store.stageConfig.scale.x || 1;
            const mousePointer = this._stage.getPointerPosition();

            if (e.deltaY > 0) {
                // zooming out
                newScale = oldScale / ScaleSettings.scaleBy;
                this._stageRef.value.$el.style.cursor = "zoom-out";
            } else {
                // zooming in
                newScale = oldScale * ScaleSettings.scaleBy;
                this._stageRef.value.$el.style.cursor = "zoom-in";
            }

            // zooming in to pointer position
            this.zoomTo(mousePointer, roundNumber(newScale));

            setTimeout(() => {
                this._scrolling--;
                if (this._scrolling === 0) {
                    this._stageRef.value.$el.style.cursor = this._cursor;
                }
            }, 100);
        } catch (error) {}
    }

    setScale(updateScale) {
        const center = {
            x: this._stage.width() / 2,
            y: this._stage.height() / 2,
        };

        this.zoomTo(center, roundNumber(updateScale));
    }

    zoomTo({ x, y }, scale) {
        try {
            const oldScale = this._stage.scaleX();

            const centerPointTo = {
                x: (x - this._stage.x()) / oldScale,
                y: (y - this._stage.y()) / oldScale,
            };

            const clampedScale = clamp(
                ScaleSettings.minScale,
                ScaleSettings.maxScale,
                scale
            );

            this._store.setStageConfig({
                ...this._store.stageConfig,
                scale: {
                    x: clampedScale,
                    y: clampedScale,
                },
                position: {
                    x: x - centerPointTo.x * clampedScale,
                    y: y - centerPointTo.y * clampedScale,
                },
            })

        } catch (error) {}
    }

    resetZoom() {
        this._store.setStageConfig({
            ...this._store.stageConfig,
            scale: {
                x: 1,
                y: 1,
            },
            position: {
                x: 0,
                y: 0,
            },
        });
    }

}
