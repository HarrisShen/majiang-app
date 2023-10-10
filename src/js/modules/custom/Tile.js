import ImageBlock from "../base/ImageBlock.js";

function Tile(parent, tileID, hover = true) {
    const src = '../../public/tiles/tile-' + tileID + '.png';
    const self = new ImageBlock(parent, {width: 64, height: 96, verticalAlign: 'bottom'}, src);
    if (hover) {
        self.onMousemove = (function (x, y) {
            this.style.verticalAlign = this.isInside(x, y) ? 'top' : 'bottom';
        });
    }
    return self;
}

export default Tile;