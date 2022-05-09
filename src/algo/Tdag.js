import {Edge, Graph} from "@/graph";
import {VertexLayout} from "@/algo/VertexLayoutData";
import {EdgeLayout} from "@/algo/EdgeLayoutData";
import {TDAGLayoutAlgo} from "@/algo/TDAGLayoutAlgo";

export class Tdag {

    /** @type {Graph<VertexLayout, EdgeLayout>} */
    _graph;

    /* settings */

    /** @type {number} */
    _gap = 20;
    /** @type {number} */
    _lineHeight = 10;
    /** @type {number} */
    _lineSpace = 4;

    constructor() {
        this._graph = new Graph();
    }

    /**
     * @param {(number | string)} id
     * @param {number} x0
     * @param {number} x1
     * @param {boolean} render
     */
    setNode({id, x0, x1, render=true}) {
        const data = new VertexLayout(x0, x1, 0, render);
        this._graph.addNode(id, data);

        return this;
    }

    /**
     * @param {(number | string)} src
     * @param {(number | string)} dst
     */
    setEdge({src, dst}) {
        if (!this._graph.nodeMap.has(src)) {
            console.error('tdagla: Can\'t find node ' + src + '. Ignored.');
            return this;
        }
        if (!this._graph.nodeMap.has(dst)) {
            console.error('tdagla: Can\'t find node ' + dst + '. Ignored.');
            return this;
        }
        const data = new EdgeLayout()
        this._graph.addEdge(src, dst, data);

        return this;
    }

    /**
     * @param id
     * @returns {null|Object}
     */
    getNode(id) {
        const node = this._graph.nodeMap.get(id);
        if (!node) {
            return null;
        }
        return {
            id: node.id,
            x: node.data.x0,
            y: this._getYTop(node.data.y),
            x0: node.data.x0,
            x1: node.data.x1,
            width: node.data.x1 - node.data.x0,
            height: this._lineHeight,
        };
    }

    /**
     * @returns {(null|Object)[]}
     */
    getNodes() {
        return this._graph.nodes.map(node => this.getNode(node.id));
    }

    /**
     * @param {(number | string)} src
     * @param {(number | string)} dst
     * @returns {null|Object}
     */
    getEdge(src, dst) {
        const srcNode = this._graph.nodeMap.get(src);
        const dstNode = this._graph.nodeMap.get(dst);
        if (!srcNode || !dstNode) {
            return null;
        }
        const edge = this._graph.edgeMap.get(Edge.getEdgeId(srcNode, dstNode));
        if (!edge) {
            return null;
        }

        const points = this._getEdgePoints(edge)

        return {
            id: edge.id,
            src: edge.src.id,
            dst: edge.dst.id,
            render: srcNode.data.render && dstNode.data.render,
            points,
        };
    }

    /**
     * @param {number} y
     * @returns {number}
     * @private
     */
    _getYTop(y) {
        return y * (this._lineHeight + this._lineSpace);
    }

    /**
     * @param {number} y
     * @returns {number}
     * @private
     */
    _getYCenter(y) {
        return y * (this._lineHeight + this._lineSpace) + this._lineHeight / 2;
    }

    /**
     * @param {Edge<VertexLayout, EdgeLayout>} edge
     * @private
     */
    _getEdgePoints(edge) {
        const src = edge.src, dst = edge.dst;

        if (!src.data.render || !dst.data.render) {
            return [];
        }

        const x0 = src.data.x1;
        const x1 = dst.data.x0;
        const x2 = dst.data.x0 + this._gap;
        const x3 = dst.data.x1;
        const y0 = this._getYCenter(src.data.y);
        const y1 = this._getYCenter(dst.data.y);
        const y2 = y1 + this._getOffsetDstY(y0, y1);

        if (edge.data.turningX === dst.data.x0) {
            // on the same line
            return [
                [x0, y0],
                [x1, y1],
            ];
        }

        if (edge.data.isHidden) {
            // unimportant broadcast edge
            if (x0 >= x1 && x2 >= x3) {
                // x2 is not valid (too narrow to the end of dst)
                const cx = (x0 + x3) / 2;
                return [
                    [x0, y0], [cx, y0],
                    [cx, y2], [x3, y2],     // use x3 and y2
                ];
            } else if (x0 >= x1) {
                // x1 is not valid but x2 is valid
                const cx = x0 + this._gap / 2;
                return [
                    [x0, y0], [cx, y0],
                    [cx, y2], [x2, y2],     // use x2 and y2
                ];
            } else {
                // x1 is valid
                const cx = (x0 + x1) / 2;
                return [
                    [x0, y0], [cx, y0],
                    [cx, y1], [x1, y1],     // use x1 and y1
                ];
            }
        }

        const tx = edge.data.turningX;
        if (tx >= x1 && tx + this._gap / 2 >= x3) {
            return [
                [x0, y0], [tx, y0],
                [tx, y2], [x3, y2],     // use x3 and y2
            ];
        } else if (tx >= x1) {
            return [
                [x0, y0], [tx, y0],
                [tx, y2], [tx + this._gap / 2, y2],     // use x2' and y2
            ];
        } else {
            return [
                [x0, y0], [tx, y0],
                [tx, y1], [x1, y1],     // use x1 and y1
            ];
        }
    }

    /**
     * @param {number} sy
     * @param {number} dy
     * @returns {number}
     * @private
     */
    _getOffsetDstY(sy, dy) {
        return (sy < dy ? -1 : 1) * this._lineHeight / 2;
    }

    /**
     * @returns {(null|Object)[]}
     */
    getEdges() {
        return this._graph.edges.map(edge => this.getEdge(edge.src.id, edge.dst.id));
    }

    /**
     * @param {number} gap
     * @returns {this}
     */
    setGap(gap) {
        this._gap = gap;
        return this;
    }

    /**
     * @returns {number}
     */
    getGap() {
        return this._gap;
    }

    /**
     * @param {number} lineHeight
     * @returns {this}
     */
    setLineHeight(lineHeight) {
        this._lineHeight = lineHeight;
        return this;
    }

    /**
     * @returns {number}
     */
    getLineHeight() {
        return this._lineHeight;
    }

    /**
     * @param {number} lineSpace
     * @returns {this}
     */
    setLineSpace(lineSpace) {
        this._lineSpace = lineSpace;
        return this;
    }

    /**
     * @returns {number}
     */
    getLineSpace() {
        return this._lineSpace;
    }

    layout() {
        if (this._graph.nodes.length === 0) {
            return;
        }
        // find root
        let root = this._graph.nodes[0];
        while (root.outEdges.length !== 0) {
            root = root.outEdges[0].dst;
        }

        // run layout algo
        let treeLayoutAlgo = new TDAGLayoutAlgo(root.id, this._graph, this._gap);
        treeLayoutAlgo.solve();
    }
}
