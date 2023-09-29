import Container from './Container.js';
import { BfsIterator, evalShape, evalPos, applyLayout } from './styleUtils.js';

class Screen extends Container {
    constructor(ctx, width, height, color) {
        super(null, {x: 0, y: 0, z: 0, width: width, height: height});
        this.ctx = ctx;
        this.color = color;
        this.focused = true;
    }

    draw() {
        this.evaluateStyle();
        this.drawScreen();
        super.draw();
    }

    evaluateStyle() {
        const iter = new BfsIterator(this);
        while (iter.node !== null) {
            let node = iter.node;
            //console.log(`evaluating shape for ${node.constructor.name}`);
            evalShape(node);
            iter.next();
        }
        iter.setNode(this);
        while (iter.node !== null) {
            let node = iter.node;
            //console.log(`evaluating position for ${node.constructor.name}`);
            evalPos(node);
            if (node.layout !== undefined)
                applyLayout(node, node.layout);
            iter.next();
        }
    }

    drawScreen() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}

export default Screen;