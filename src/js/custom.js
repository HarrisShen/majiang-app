import ImageBlock from "./modules/ImageBlock.js";

function Tile(parent) {
    const self = new ImageBlock(parent, {width: 64, height: 96, verticalAlign: 'bottom'}, '../../public/tiles/tile-11.png');
    self.onMousemove = (function (x, y) {
        this.style.verticalAlign = this.isInside(x, y) ? 'top' : 'bottom';
    });
    return self;
}

export { Tile };
