import { mapStepable } from './mapStepable';
import { Canvas } from './objects/canvas';

export class Map {
    constructor(config, online, player) {
        this.config = config;
        this.player = player;
        this.online = online;
        this.class = 'map';
        this.canvas;
        this.context;
        this.map;
        this.stepable;
        this.elements = [];
        this.canvas_obj;
    }

    async init() {
        this.canvas_obj = new Canvas();
        [this.canvas, this.context] = this.canvas_obj.createCanvas(this.class, this.config.canvas.width, this.config.canvas.height);
        await this.setElement(`${this.config.images}/map/map.jpg`, 'map', 3840, 2160, this.config.canvas.x, this.config.canvas.y);
        await this.drawMap(await this.player.getPlayerPos());
        this.canvas_obj.addCanvas(`#${this.class}`, this.canvas);
        this.stepable = new mapStepable(this.config, this.player);
        await this.stepable.init();
    }

    async setElement(src, className, width, height, x, y) {
        const image = this.canvas_obj.createImage(src, width, height, className);
        let element = { object: image, x: x, y: y };
        this.elements.push(element);
    }

    async drawMap(player_pos) {
        this.canvas_obj.reload(this.context,this.canvas);
        this.canvas_obj.save(this.context);
        this.elements.forEach(async (image) => {
            let x = player_pos.x - image.x;
            let y = player_pos.y - image.y;
            await this.context.drawImage(image.object, x, y, image.object.width, image.object.height, 0, 0, image.object.width, image.object.height);
        });
        this.canvas_obj.restore(this.context);
    }

    async drawPlayers() {
        let players = await this.online.getPlayers();

        Object.keys(players).forEach(async (player) => {
            await player.drawPlayer();
        });
    }
}