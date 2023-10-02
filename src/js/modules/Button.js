import Component from './Component.js';

class Button extends Component {
    color = '#AAAAAA';
    fontColor = '#000000';

    clickable = true;
    hoverable = true;
    onClick = () => { };
    onMousemove = (x, y) => {
        if (this.style.disabled) return;
        this.color = this.isInside(x, y) ? '#CCCCCC' : '#AAAAAA';
    }

    constructor(parent, style, text) {
        super(parent, style);
        this.text = text;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = this.style.disabled ? '#666666' : '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    setOnClick(onClick) {
        this.onClick = () => {
            if (this.style.disabled) return;
            onClick();
        };
    }
}

export default Button;