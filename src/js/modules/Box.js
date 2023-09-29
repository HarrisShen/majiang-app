import Container from "./Container.js";

class Box extends Container {
    color = null;
    outline = null;

    constructor(parent, style, layout, color, outline) {
        super(parent, style);
        this.layout = layout;
        this.color = color;
        this.outline = outline;
    }

    draw() {
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