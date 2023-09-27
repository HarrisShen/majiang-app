import { applyStyle } from './styleUtils.js';

/**
 * Base class for all UI elements
 * Avoid instantiating this class directly 
 */
class Element {
    ctx = null;
    clickable = false;
    hoverable = false;

    x = null;
    y = null;
    z = null;
    width = null;
    height = null;

    constructor(parent = null, style = {}) {
        this.parent = parent;
        this.style = style;
        
        // let { x, y, z, width, height } = applyStyle(parent, style);
        // this.x = x;
        // this.y = y;
        // this.z = z;
        // this.width = width;
        // this.height = height;

        if (parent !== null) {
            parent.addComponent(this);
            // fetch parent's context
            this.ctx = parent.ctx;
        }
    }
    
    evaluateStyle() {
        if (this.x !== null && this.y !== null && this.z !== null
            && this.width !== null && this.height !== null) {
            return;
        }

        let { x, y, z, width, height } = applyStyle(this.parent, this.style);
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
    }

    isFocused() {
        if (this.parent === null) {
            return false;
        }
        return this.parent.isFocused();
    }

    isInside(x, y) {
        return (x >= this.x && x <= this.x + this.width
            && y >= this.y && y <= this.y + this.height);
    }
}

export default Element;