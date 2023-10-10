import Component from './Component.js';

/**
 * Base class for all container components
 * Avoid instantiating this class directly
 */
class Container extends Component {
    focused = false;
    components = [];

    addComponent(component) {
        this.components.push(component);
    }

    removeComponent(component) {
        this.components = this.components.filter(c => c !== component);
    }

    removeAll() {
        this.components = [];
    }

    draw() {
        this.components.forEach(component => {
            component.draw();
        });
    }

    onClick(x, y) {
        if (!this.clickable) return;
        this.components.forEach(component => {
            if (component.isFocused() && component.isInside(x, y)) {
                if (component instanceof Container) component.onClick(x, y);
                else if (typeof component.onClick === 'function') component.onClick();
            }
        });
    }

    passMousemove(x, y) {
        this.components.forEach(component => {
            if (component.isFocused()) {
                if (component instanceof Container) component.passMousemove(x, y);
                else if (component.hoverable) component.onMousemove(x, y);
            }
        });
    }
}

export default Container;