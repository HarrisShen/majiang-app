import Container from "./Container.js";
import Button from "./Button.js";

class Dialog extends Container {
    constructor(parent, color) {
        const width = parent.width * 0.8;
        const height = parent.height * 0.8;
        const x = parent.x + parent.width / 2 - width / 2;
        const y = parent.y + parent.height / 2 - height / 2;

        super(parent, x, y, width, height);
        this.color = color;
        this.focused = true;
        parent.focused = false;

        this.closeButton = new Button(this, 40, 40, x + width - 60, y + 20, 'X');
        this.closeButton.onClick = () => {
            console.log('close dialog');
            this.close();
        }

        this.comfirmButton = new Button(this, 100, 40, x + width - 120, y + height - 60, 'OK!');
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        super.draw();
    }

    close() {
        this.parent.removeComponent(this);
        this.parent.focused = true;
    }

    setOnConfirm(callback) {
        this.comfirmButton.onClick = () => {
            callback();
            this.close();
        }
    }
}

export default Dialog;