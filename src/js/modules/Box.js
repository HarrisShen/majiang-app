import Container from "./Container.js";

class Box extends Container {
    color = null;
    outline = null;

    constructor(parent, style, color, outline) {
        super(parent, style);
        this.color = color;
        this.outline = outline;
    }

    draw() {
        // convert style to absolute position and size, if not already
        this.evaluateStyle();

        if (this.color !== null) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);            
        }
        if (this.outline !== null) {
            this.ctx.strokeStyle = this.outline;
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        super.draw();
    }
}

export default Box;