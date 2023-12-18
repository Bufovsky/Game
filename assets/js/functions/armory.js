import { Slot } from '../objects/slot'

export class Armory {
	constructor(player) {
		this.config = player.config;
		this.player = player;
		this.state = false;
		this.class = 'armory';
		this.slots = ['helmet', 'sword', 'armor', 'shield', 'legs', 'boots', 'rune_1', 'rune_2', 'rune_3', 'rune_4'];
		this.slot;
		this.armory;
	}

	async init() {
		this.slot = new Slot(this.class, this.config);
		this.armory = await this.getArmoryQuery();

		await this.container();
		await this.addItemsToArmory();
	}

	async getArmoryQuery() {
		let game_type = await this.player.get('type');
		const sql = `SELECT * FROM armory WHERE game = '${game_type}';`;

		return await this.config.db.query(sql);
	}

	async container() {
		let div = this.slot.container([this.class]);
		let armory_title = this.slot.title(this.class);
		div.appendChild(armory_title);

		this.slot.slots.forEach(async (slot) => {
			let slot_row = this.slot.container([slot, 'slot_row']);
			let slot_row_title = this.slot.itemSlot(['empty', 'background'], slot, ['empty']);
			slot_row.appendChild(slot_row_title);

			for (let i = 1; i < 5; i++) {
				let slot_class = `slot_${slot}_${i}`;
				let slot_box = this.slot.itemSlot([slot_class], slot);
				slot_box.addEventListener("click", function () {
					this.getItem(slot_class,);
				});
				slot_row.appendChild(slot_box);
			}

			div.appendChild(slot_row);
		});

		let armory = document.getElementById(this.class);
		armory.insertBefore(div, armory.childNodes[0]);
	}

	async addItemsToArmory() {
		this.armory.forEach(async (item) => {
			this.slot.setItemToSlot(`.slot_${item.slot}_${item.position}`, item);
		});
	}

	async getItem(slot, id) {
		let points = await this.player.get('points');
		let item_points = item.points;
		let item_parameters = this.items[id];
		if (points >= item_points) {
			let new_points = points - item_points;
			this.player.set('points', new_points);
			this.player.set(item_parameters['slot'], id);
			//update player skills

			//update db
			await this.socket.queue('equipPlayer', { "id": this.player_info.id, "item": id });
		}
	}

	async findItem(type, value) {
		value = [value];
		const item = this.items.find(item => item && value.includes(item[type]));

		return item || null;
	}
}