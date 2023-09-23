import Element from './Element.js';

class Container extends Element {
    components = [];

    addComponent(component) {
        this.components.push(component);
    }

    draw() {
        this.components.forEach(component => {
            component.draw();
        });
    }
}

export default Container;