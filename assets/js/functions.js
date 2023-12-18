import { Armory } from "./functions/armory";

export class Functions {
	constructor(config, player) {
		this.armory;
		this.player = player;
		this.config = config;
	}

	async init() {
		this.armory = new Armory(this.player);
		await this.armory.init();
	}
}