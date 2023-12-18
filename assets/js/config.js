import { Database } from './database'

export class Config {
	constructor() {
		this.host = "http://localhost";
		this.port = "3000";
		this.port_8080 = "8080";
		this.queue = this.host + ":" + this.port;
		this.api = `${this.queue}/query`;
		this.images = this.host + ":" + this.port_8080 + "/images";
		this.objects = this.host + ":" + this.port_8080 + "/objects";

		this.map = {}
		this.map.drawStepableShadow = true;

		this.outfit = {};
		this.outfit.width = 32;
		this.outfit.height = 32;
		this.outfit.sprite = {};
		this.outfit.sprite.width = 64;
		this.outfit.sprite.height = 64;

		this.canvas = {};
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.x = ( window.innerWidth / 2 ) + ( this.outfit.width / 2 );
		this.canvas.y = ( window.innerHeight / 2 ) + ( this.outfit.height / 2 );
		this.canvas.map_width = 3840;
		this.canvas.map_height = 2160;

		/**
		 * DATABASE
		 */
		
		this.db = new Database(this);
		this.items;
	}

	async itemsInit() {
		this.items = await this.db.query('SELECT * FROM items');
	}
}