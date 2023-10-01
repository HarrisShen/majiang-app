/**
 * @module styleUtils
 * @description
 * This module contains functions for applying styles to UI elements.
 * Style keys:
 * - x, y: position, absolute coordiate on canvas
 * - width, height: size, absolute in pixels, mandatory for all elements
 * - z: z-index, higher values are drawn on top of lower values
 * - verticalAlign: 'top', 'middle', 'bottom'
 * - horizontalAlign: 'left', 'center', 'right'
 * If all of the above are specified, the element is drawn at the specified position and size, i.e. alignment is ignored.
 * 
 * Layout keys:
 * - type: 'row', 'column', 'grid'
 * - rows: number of rows in grid
 * - cols: number of columns in grid
 * - justify: 'start', 'center', 'end'
 * - spacing: number of pixels between elements
 * - padding: number of pixels around the outside of the layout
 */

class BfsIterator {
    constructor(node) {
        this.node = node;
        this.queue = [];
    }

    next() {
        if (this.node === null) return;
        if (this.node.components !== undefined) {
            for (let i = 0; i < this.node.components.length; i++) {
                this.queue.push(this.node.components[i]);
            }
        }

        let node = this.queue.shift();
        if (node === undefined) {
            this.node = null;
            return;
        }
        this.node = node;
    }

    setNode(node) {
        this.node = node;
        this.queue = [];
    }
}

function evalShape(self) {
    const style = self.style;
    self.width = style.width || 0;
    self.height = style.height || 0;
    //console.log(`type: ${self.constructor.name}, width: ${self.width}, height: ${self.height}`);
}

function evalPos(self) {
    const style = self.style;
    const layout = self.layout;
    const parent = self.parent;
    let x, y, z;

    // apply position if specified
    x = style.x || layout.x || self.x || 0;
    y = style.y || layout.y || self.y || 0;
    z = style.z || self.z || 0;

    // apply horizontal alignment if x not specified
    if (style.x === undefined && layout.x === undefined) {
        //console.log('x not specified');
        const hAlign = style.horizontalAlign || 'left';
        switch (hAlign) {
            case 'left':
                x = 0;
                break;
            case 'center':
                x = (parent.width - self.width) / 2;
                break;
            case 'right':
                x = parent.width - self.width;
                break;
        }
        x += parent.x;
    }

    // apply vertical alignment if y not specified
    if (style.y === undefined && layout.y === undefined) {
        //console.log('y not specified');
        const vAlign = style.verticalAlign || 'top';
        switch (vAlign) {
            case 'top':
                y = 0;
                break;
            case 'middle':
                y = (parent.height - self.height) / 2;
                break;
            case 'bottom':
                y = parent.height - self.height;
                break;
        }
        y += parent.y;
    }

    //console.log(`type: ${self.constructor.name} x: ${x}, y: ${y}, z: ${z}`);
    self.x = x;
    self.y = y;
    self.z = z;
}

function applyLayout(self) {
    if (self.layout === undefined) {
        return;
    }
    const layout = self.layout;
    switch (layout.type) {
        case 'row':
            applyRowLayout(self);
            break;
        case 'column':
            applyColumnLayout(self);
            break;
        case 'grid':
            applyGridLayout(self);
            break;
    }
}

function applyRowLayout(self) {
    const layout = self.layout;
    const components = self.components;
    const padding = layout.padding || 0;
    const spacing = layout.spacing || 0;
    const justify = layout.justify || 'start';
    let x;
    switch (justify) {
        case 'start':
            x = self.x + padding;
            for (let i = 0; i < components.length; i++) {
                components[i].layout.x = x;
                x += components[i].width + spacing;
            }
            break;
        case 'center':
            x = self.x;
            let totalWidth = 0;
            for (let i = 0; i < components.length; i++) {
                components[i].layout.x = x;
                x += components[i].width + spacing;
                totalWidth += components[i].width;
                if (i > 0) totalWidth += spacing;
            }
            for (let i = 0; i < components.length; i++) {
                components[i].layout.x += (self.width - totalWidth) / 2;
            }
            break;
        case 'end':
            x = self.x + self.width - padding;
            for (let i = components.length - 1; i >= 0; i--) {
                x -= components[i].width;
                components[i].layout.x = x;
                x -= spacing;
            }
            break;
    }
}

function applyColumnLayout(self) {
    const layout = self.layout;
    const components = self.components;
    const padding = layout.padding || 0;
    const spacing = layout.spacing || 0;
    const justify = layout.justify || 'start';
    let y;
    switch (justify) {
        case 'start':
            y = self.y + padding;
            for (let i = 0; i < components.length; i++) {
                components[i].layout.y = y;
                y += components[i].height + spacing;
            }
            break;
        case 'center':
            y = self.y;
            let totalHeight = 0;
            for (let i = 0; i < components.length; i++) {
                components[i].layout.y = y;
                y += components[i].height + spacing;
                totalHeight += components[i].height;
                if (i > 0) totalHeight += spacing;
            }
            for (let i = 0; i < components.length; i++) {
                components[i].layout.y += (self.height - totalHeight) / 2;
            }
            break;
        case 'end':
            y = self.y + self.height - padding;
            for (let i = components.length - 1; i >= 0; i--) {
                y -= components[i].height;
                components[i].layout.y = y;
                y -= spacing;
            }
            break;
    }
}

// Not tested
function applyGridLayout(self) {
    const layout = self.layout;
    const components = self.components;
    let x = layout.padding || 0, y = layout.padding || 0;
    x += self.x, y += self.y;
    const rows = layout.rows || 1;
    const cols = layout.cols || 1;
    const spacing = layout.spacing || 0;
    const width = (self.width - 2 * layout.padding - (cols - 1) * spacing) / cols;
    const height = (self.height - 2 * layout.padding - (rows - 1) * spacing) / rows;
    for (let i = 0; i < components.length; i++) {
        const c = components[i];
        const row = Math.floor(i / cols);
        const col = i % cols;
        c.x = x + col * (width + spacing);
        c.y = y + row * (height + spacing);
        c.width = width;
        c.height = height;
    }
}


export { BfsIterator, evalShape, evalPos, applyLayout };