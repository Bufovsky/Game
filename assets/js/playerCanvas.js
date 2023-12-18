import { Canvas } from './objects/canvas';

export class PlayerCanvas {
    constructor(player) {
        this.config = player.config;
        this.player = player;
        this.player_class = `player_${player.id}`;
        this.player_id = player.id;
        this.canvas_obj;
        this.canvas;
        this.context;
        this.image;
    }

    async init() {
        this.canvas_obj = new Canvas();
        [this.canvas, this.context] = this.canvas_obj.createCanvas([this.player_class], this.config.canvas.width, this.config.canvas.height);
        await this.setOutfit();
        this.canvas_obj.addCanvas('#players', this.canvas);
        this.drawPlayer(this.config.canvas.x, this.config.canvas.y);
    }

    async setOutfit() {
        const className = `player_${this.player_id}`;
        const outfit = await this.player.get('outfit');
        const src = `${this.config.images}/outfits/outfit_${outfit}.png`;
        this.image = this.canvas_obj.createImage(src, this.config.outfit.width, this.config.outfit.height, className);
    }

    async getOtherPlayerPos(current_pos, other_player_pos) {
        let x = other_player_pos.x - ( current_pos.x - (this.config.canvas.width / 2) - (this.config.outfit.width / 2));
        let y = other_player_pos.y - ( current_pos.y - (this.config.canvas.height / 2) - (this.config.outfit.height / 2));
        let direction = other_player_pos.direction;

        return {x:x, y:y, direction:direction};
    }

    async drawPlayer(player_pos) {
        let direction = await this.setDirection(player_pos);
        await this.canvas_obj.reload(this.context, this.canvas);
        await this.canvas_obj.save(this.context);
        await this.context.translate(player_pos.x, player_pos.y);
        await this.context.drawImage(this.image, direction.x, direction.y, this.config.outfit.width, this.config.outfit.height, 0, 0, this.config.outfit.sprite.width, this.config.outfit.sprite.height);
        await this.canvas_obj.restore(this.context);
    }

    async setDirection(player_pos) {
        let direction = {x:0, y:0};

        switch(player_pos.direction) {
            case 'left':
                direction.y = 32;
                break;
            case 'right':
                direction.y = 64;
                break;
            case 'up':
                direction.y = 96;
                break;
            case 'down':
                direction.y = 0;
                break;
            default:
                direction.y = 0;
        }

        return direction;
    }
}