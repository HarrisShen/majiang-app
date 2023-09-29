//import { applyStyle } from './styleUtils.js';

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

        if (parent !== null) {
            parent.addComponent(this);
            // fetch parent's context
            this.ctx = parent.ctx;
        }
    }

    isFocused() {
        let ptr = this;
        while (ptr !== null) {
            if (ptr.focused) return true;
            ptr = ptr.parent;
        }
        return false;
    }

    isInside(x, y) {
        return (x >= this.x && x <= this.x + this.width
            && y >= this.y && y <= this.y + this.height);
    }
}

export default Element;