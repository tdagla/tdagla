export class VertexLayout {
    /** @type {number} */
    x0
    /** @type {number} */
    x1
    /** @type {number} */
    y
    /** @type {string} */
    vertexName
    /** @type {boolean} */
    toRender

    /**
     * @param {number} x0
     * @param {number} x1
     * @param {number} y
     * @param {boolean} toRender
     * @param {string} vertexName
     */
    constructor(x0, x1, y, toRender, vertexName) {
        this.x0 = x0
        this.x1 = x1
        this.y = y
        this.vertexName = vertexName
        this.toRender = toRender
    }
}
