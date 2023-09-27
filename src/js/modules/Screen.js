import Container from './Container.js';

class Screen extends Container {
    constructor(ctx, width, height, color) {
        super(null, {x: 0, y: 0, width: width, height: height});
        this.ctx = ctx;
        this.color = color;
        this.focused = true;
        this.evaluateStyle();
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