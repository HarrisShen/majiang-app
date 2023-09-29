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
 * - justify: 'start', 'center', 'end', 'space-around', 'space-between'
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
    const parent = self.parent;
    let x, y, z;

    // apply position if specified
    x = style.x || self.x;
    y = style.y || self.y;
    z = style.z || self.z;

    // apply horizontal alignment if x not specified
    if (style.x === undefined && self.x === null) {
        //console.log('x not specified');
        switch (style.horizontalAlign) {
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
    if (style.y === undefined && self.y === null) {
        //console.log('y not specified');
        switch (style.verticalAlign) {
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

    x = x || 0;
    y = y || 0;
    z = z || 0;

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
            applyRowLayout(self, layout);
            break;
        case 'column':
            applyColumnLayout(self, layout);
            break;
        case 'grid':
            applyGridLayout(self, layout);
            break;
    }
}

function applyRowLayout(self, layout) {
    const components = self.components;
    let x = layout.padding || 0, y = layout.padding || 0;
    x += self.x, y += self.y;
    for (let i = 0; i < components.length; i++) {
        const c = components[i];
        c.x = x;
        c.y = y;
        x += c.width + layout.spacing;
    }
}

function applyColumnLayout(self, layout) {
    const components = self.components;
    const padding = layout.padding || 0;
    const spacing = layout.spacing || 0;
    let y = padding;
    y += self.y;
    for (let i = 0; i < components.length; i++) {
        components[i].y = y;
        y += components[i].height + spacing;
    }
}

function applyGridLayout(self, layout) {
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