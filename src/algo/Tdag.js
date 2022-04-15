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
    setNode({id, x0, x1, render=false}) {
        const data = new VertexLayout(x0, x1, 0, render, 'node-' + id);
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
     * @returns {null|VertexLayout}
     */
    getNode(id) {
        const node = this._graph.nodeMap.get(id);
        if (!node) {
            return null;
        }
        return Object.assign({}, node.data);
    }

    /**
     * @param {(number | string)} src
     * @param {(number | string)} dst
     * @returns {null | EdgeLayout}
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
        return Object.assign({}, edge.data);
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
