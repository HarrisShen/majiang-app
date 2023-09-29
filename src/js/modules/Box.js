import Container from "./Container.js";
//import { applyLayout } from "./styleUtils.js";

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
        // convert style to absolute position and size, if not already
        //this.evaluateStyle();

        if (this.color !== null) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);            
        }
        if (this.outline !== null) {
            this.ctx.strokeStyle = this.outline;
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        //this.evaluateLayout();
        super.draw();
    }

    evaluateLayout() {
        applyLayout(this, this.layout);
    }
}

export default Box;