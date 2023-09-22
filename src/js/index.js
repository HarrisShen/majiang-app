class Button {
    constructor(width, height, x, y, color) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isInside(x, y) {
        return (x >= this.x && x <= this.x + this.width
            && y >= this.y && y <= this.y + this.height);
    }
}

const button = new Button(150, 50, (canvas.width - 150) / 2, (canvas.height - 50) / 2, '#00FF00');

function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    button.draw(ctx);

    // const img = new Image();
    // img.addEventListener('load', () => {
    //     ctx.drawImage(img, 10, 10);
    // }, false);
    // img.src = '../../public/tiles/tile-11.png';
}

canvas.addEventListener('click', (e) => {
    let x = e.clientX, y = e.clientY;
    console.log(x + ',' + y);
    if (button.isInside(x, y)) {
        console.log('clicked');
    }
});

window.addEventListener('load', draw);