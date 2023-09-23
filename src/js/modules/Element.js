class Element {
    components = [];

    constructor(ctx = null, parent = null) {
        this.ctx = ctx;
        this.parent = parent;
    }
    
    draw() {
        this.components.forEach(component => {
            component.draw();
        });
    }
}

export default Element;