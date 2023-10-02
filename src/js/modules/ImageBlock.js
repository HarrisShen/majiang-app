import Component from "./Component.js";

class ImageBlock extends Component {
    clickable = true;
    hoverable = true;

    onClick = () => {};
    onMousemove = () => {};
    
    src = null;
    img = null;

    constructor(parent, style, src) {
        super(parent, style);
        this.src = src;
        this.img = new Image();
        this.img.src = src;
    }

    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

export default ImageBlock;