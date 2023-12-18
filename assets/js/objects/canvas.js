export class Canvas {
    constructor() {
    }

    createCanvas(id, width, height) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        canvas.classList.add(...id);

        return [canvas, context];
    }

    create3dCanvas(id, width, height) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext('webgl2', {
            antialias: true,
            alpha: false
        });
        // canvas.width = width;
        // canvas.height = height;
        canvas.classList.add(...id);

        if (!context) {
            console.error('Unable to initialize WebGL 2.0. Your browser may not support it.');
            return;
        }

        return [canvas, context];
    }

    addCanvas(id, canvas) {
        let div = document.querySelector(id);
        div.insertBefore(canvas, div.childNodes[0]);
    }

    removeCanvas(id) {
        let canvas = document.querySelector(id);
        canvas ? canvas.remove() : null;
    }

    createImage(src, width, height, id) {
        const img = new Image();

        img.src = src;
        img.width = width;
        img.height = height;
        img.classList.add(...id);
        
        return img;
    }

    reload(context,canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    save(context) {
        context.save();
    }

    restore(context) {
        context.restore();
    }
}