import Screen from "../base/Screen.js";
import Label from "../base/Label.js";
import Box from "../base/Box.js";
import Button from "../base/Button.js";
import Dialog from "../base/Dialog.js";

function MainScreen(ctx, canvas, socket) {
    const mainScreen = new Screen(ctx, canvas.width, canvas.height, "#7CB9E8");

    const gameTitle = new Label(mainScreen, {x: canvas.width / 2, y: 200}, 'Minimal Mahjong', '60px Arial Bold', '#000000', 'center', 'middle')

    const buttonBox = new Box(
        mainScreen, 
        {width: 250, height: 200, verticalAlign: 'middle', horizontalAlign: 'center'}, 
        {type: 'column', justify: 'center', padding: 20, spacing: 30}, 
        null, null);
    
    const createButton = new Button(
        buttonBox, {width: 200, height: 50, horizontalAlign: 'center'}, 
        'Create table');
    createButton.setOnClick(() => {
        console.log('CREATE clicked');
        const d = new Dialog(mainScreen, '#FFFFFF');
        d.setOnConfirm(() => {
            console.log('OK clicked');
            socket.emit('table:create', 1);
            d.confirmButton.style.disabled = true;
        });
    });
    
    const joinButton = new Button(
        buttonBox, {width: 200, height: 50, horizontalAlign: 'center'}, 
        'Join table');
    joinButton.onClick = () => {
        console.log('JOIN clicked');
        const d = new Dialog(mainScreen, '#FFFFFF');
        d.setOnConfirm(() => {
            console.log('OK clicked');
        });
    };
    
    const toggleButton = new Button(
        buttonBox, {width: 200, height: 50, horizontalAlign: 'center'},
        'Toggle');
    toggleButton.setState('toggle', true, () => {
        toggleButton.text = toggleButton.toggle ? 'Toggle' : 'Untoggle';
    });
    toggleButton.onClick = () => {
        console.log('TOGGLE clicked');
        toggleButton.toggle = !toggleButton.toggle;
    };

    return mainScreen;
}

export default MainScreen;