import ImageBlock from "./modules/ImageBlock.js";

function Tile(parent, tileID) {
    const src = '../../public/tiles/tile-' + tileID + '.png';
    const self = new ImageBlock(parent, {width: 64, height: 96, verticalAlign: 'bottom'}, src);
    self.onMousemove = (function (x, y) {
        this.style.verticalAlign = this.isInside(x, y) ? 'top' : 'bottom';
    });
    return self;
}

export { Tile };
