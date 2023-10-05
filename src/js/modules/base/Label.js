import Component from "./Component.js";

class Label extends Component {
    text = '';

    constructor(parent, style, text, font, color, align, baseline) {
        super(parent, style);
        this.text = text;
        this.font = font;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
    }

    draw() {
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = this.align;
        this.ctx.textBaseline = this.baseline;
        this.ctx.fillText(this.text, this.x, this.y);
    }
}

export default Label;