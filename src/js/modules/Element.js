class Element {
    ctx = null;
    clickable = false;
    hoverable = false;

    constructor(parent = null, x = 0, y = 0, width = 0, height = 0, z = 0) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;

        if (parent !== null) {
            parent.addComponent(this);
            // fetch parent's context
            this.ctx = parent.ctx;
        }
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