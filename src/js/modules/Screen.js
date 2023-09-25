import Container from './Container.js';

class Screen extends Container {
    constructor(ctx, width, height, color) {
        super(null, 0, 0, width, height);
        this.ctx = ctx;
        this.color = color;
        this.focused = true;
    }

    draw() {
        this.drawScreen();
        super.draw();
    }

    drawScreen() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}

export default Screen;