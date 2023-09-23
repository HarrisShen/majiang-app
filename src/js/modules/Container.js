import Element from './Element.js';

class Container extends Element {
    addComponent(component) {
        this.components.push(component);
    }
}

export default Container;