import Element from './Element.js';

class Container extends Element {
    focused = false;
    components = [];

    isFocused() { return this.focused; }

    addComponent(component) {
        this.components.push(component);
    }

    removeComponent(component) {
        this.components = this.components.filter(c => c !== component);
    }

    draw() {
        this.components.forEach(component => {
            component.draw();
        });
    }

    passClick(x, y) {
        this.components.forEach(component => {
            if (component.isFocused() && component.isInside(x, y)) {
                if (component.clickable) component.onClick();
                else component.passClick(x, y);
            }
        });
    }
}

export default Container;