import Container from "./Container.js";

class Dialog extends Container {
    constructor(parent, color) {
        const width = parent.width * 0.8;
        const height = parent.height * 0.8;
        const x = parent.x + parent.width / 2 - width / 2;
        const y = parent.y + parent.height / 2 - height / 2;

        super(parent, x, y, width, height);
        this.color = color;
        this.focused = true;
        parent.focused = false;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        super.draw();
    }
}

export default Dialog;