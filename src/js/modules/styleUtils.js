/**
 * @module styleUtils
 * @description
 * This module contains functions for applying styles to UI elements.
 * Style keys:
 * - x, y: position, absolute coordiate on canvas
 * - width, height: size, absolute in pixels
 * - z: z-index, higher values are drawn on top of lower values
 * - verticalAlign: 'top', 'middle', 'bottom'
 * - horizontalAlign: 'left', 'center', 'right'
 * If all of the above are specified, the element is drawn at the specified position and size, i.e. alignment is ignored.
 */


function applyStyle(parent, style) {
    let x, y, z, width, height;

    // apply position and size if specified
    x = style.x || 0;
    y = style.y || 0;
    z = style.z || 0;
    width = style.width || 0;
    height = style.height || 0;

    // apply horizontal alignment if x not specified
    if (style.x === undefined) {
        switch (style.horizontalAlign) {
            case 'left':
                x = 0;
                break;
            case 'center':
                x = (parent.width - width) / 2;
                break;
            case 'right':
                x = parent.width - width;
                break;
        }
        x += parent.x;
    }

    // apply vertical alignment if y not specified
    if (style.y === undefined) {
        switch (style.verticalAlign) {
            case 'top':
                y = 0;
                break;
            case 'middle':
                y = (parent.height - height) / 2;
                break;
            case 'bottom':
                y = parent.height - height;
                break;
        }
        y += parent.y;
    }

    console.log(`x: ${x}, y: ${y}, z: ${z}, width: ${width}, height: ${height}`);
    return { x, y, z, width, height };
}

export { applyStyle };