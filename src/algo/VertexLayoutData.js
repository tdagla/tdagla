export class VertexLayout {
    /** @type {number} */
    x0
    /** @type {number} */
    x1
    /** @type {number} */
    y
    /** @type {boolean} */
    render

    /**
     * @param {number} x0
     * @param {number} x1
     * @param {number} y
     * @param {boolean} render
     */
    constructor(x0, x1, y, render) {
        this.x0 = x0
        this.x1 = x1
        this.y = y
        this.render = render
    }
}
