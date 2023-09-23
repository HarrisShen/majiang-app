import Container from './Container.js';

class MainScreen extends Container {
    constructor(ctx, width, height) {
        super(null, 0, 0, width, height);
        this.ctx = ctx;
    }

    draw() {
        this.drawScreen();
        super.draw();
    }

    drawScreen() {
        this.ctx.fillStyle = '#7CB9E8'
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // addComponent(component) {
    //     super.addComponent(component);
    //     component.ctx = this.ctx;
    // }

    onClick(x, y) {
        this.components.forEach(component => {
            if (component.isInside(x, y)) {
                component.onClick();
            }
        });
        this.draw();
    }
}

export default MainScreen;