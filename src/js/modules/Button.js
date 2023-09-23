import Element from './Element.js';

class Button extends Element {
    clickable = true;
    onClick = () => { };

    constructor(parent, width, height, x, y, color, text) {
        super(parent, x, y, width, height);
        this.color = color;
        this.text = text;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
}

export default Button;