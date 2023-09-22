class Container {
    constructor() {
        this.components = [];
    }

    draw() {
        this.components.forEach(component => {
            component.draw();
        });
    }

    addComponent(component) {
        this.components.push(component);
    }
}

export default Container;