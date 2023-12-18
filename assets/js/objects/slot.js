export class Slot {
    constructor(className, config) {
        this.config = config;
        this.skills = ['level', 'points', 'magic', 'attack', 'defence', 'speed', 'health_restore', 'mana_restore'];
        this.slots = ['rune_1', 'helmet', 'rune_2', 'sword', 'armor', 'shield', 'rune_3', 'boots', 'rune_4'];
        this.state = false;
        this.class = className;
    }

    container(id) {
        let container = document.createElement("div");
        container.classList.add(...id);

        return container;
    }

    title(title, id = null) {
        let title_div = document.createElement('div');
        title_div.classList.add('title');
        title_div.innerHTML = title;

        if ( id != null ) {
            title_div.classList.add('');
        }

        return title_div;
    }

    skillRow(id, title, value) {
        let skill_div = document.createElement('div');
        skill_div.classList.add('skill_row', 'centering');

        let skill_title = document.createElement('div');
        skill_title.classList.add(`skill_title`);
        skill_title.innerHTML = title;

        skill_div.appendChild(skill_title);

        let skill_value = document.createElement('div');
        skill_value.classList.add(`skill_value`);
        skill_value.innerHTML = value;

        skill_div.appendChild(skill_value);

        return skill_div;
    }

    itemSlot(id, item, options = []) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.classList.add(...id);

        if (options.includes('empty')) {
            slot.style.backgroundImage = `url('${this.config.images}/equipment/slots/${item}.png')`;
        }

        return slot;
    }

    setItemToSlot(slot, item) {
        let slot_div = document.querySelector(slot);
        if (slot_div) {
            slot_div.style.backgroundImage = `url('${this.config.images}/equipment/${item.category}/${item.slot}.png')`;
            slot_div.setAttribute('onclick', item.id);
        }
    }

	async switch(site) {
		let container = document.getElementById(this.class);

		if (this.state == false) {
			container.style[site] = '0vw';
			this.state = true;
		} else {
			container.style[site] = '-20vw';
			this.state = false;
		}
	}
}