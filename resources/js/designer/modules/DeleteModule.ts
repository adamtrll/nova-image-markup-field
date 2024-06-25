import DesignerModule from './DesignerModule'

const DeleteKeys = ['Backspace', 'Delete']

export default class DeleteModule extends DesignerModule {
    // event handlers
    private _onDocumentKeyUpHandler: any = null

    private _store
    private _transformerNode

    constructor(store, transformerNode) {
        super()

        this._store = store
        this._transformerNode = transformerNode

        this._onDocumentKeyUpHandler = this.handleDocumentKeyUp.bind(this)

        document.addEventListener('keyup', this._onDocumentKeyUpHandler)
    }


    destruct() {
        document.removeEventListener('keyup', this._onDocumentKeyUpHandler)
    }

    handleDocumentKeyUp(e) {
        if (DeleteKeys.includes(e.key) && e.target.localName !== 'input') {
            this.deleteSelected()
        }
    }

    deleteSelected() {
        this._store.selectedDrawables.forEach((d) => {
            this._store.drawableItemDeleteById(d.id)
        })

        this._transformerNode.nodes([])
    }
}
