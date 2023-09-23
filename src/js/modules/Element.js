class Element {
    ctx = null;

    constructor(parent = null, x = 0, y = 0, width = 0, height = 0) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        if (parent !== null) {
            parent.addComponent(this);
            // fetch parent's context
            this.ctx = parent.ctx;
        }
    }
}

export default Element;