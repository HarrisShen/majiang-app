import Element from "./Element.js";

class ImageBlock extends Element {
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