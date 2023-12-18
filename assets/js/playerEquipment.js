import { Slot } from './objects/slot'

export class PlayerEquipment {
    constructor(player, items) {
        this.player = player;
        this.class = "equipment";
        this.slot;
        this.items = items;
    }

    async init() {
        this.slot = new Slot(this.class, this.player.config);

        // await this.container();
        // await this.setEquipmentAttributes();
    }

    async container() {
        let div = this.slot.container([this.class]);
        let eq_title = this.slot.title(this.class);
        let eq_div = this.slot.container(['space', 'grid_eq']);
        let skills_title = this.slot.title('SKILLS');
        let skill_div = this.slot.container(['space', 'grid_skill']);
             
        this.slot.slots.forEach(async (slot) => {
            let slot_row = this.slot.itemSlot([slot], slot, ['empty']);
            eq_div.appendChild(slot_row);
        });

        this.slot.skills.forEach(async (skill) => {
            let skill_value = await this.player.get(skill);
            let skill_row = this.slot.skillRow('', skill, skill_value);
            skill_div.appendChild(skill_row);
        });

        div.appendChild(eq_title);
        div.appendChild(eq_div);
        div.appendChild(skills_title);
        div.appendChild(skill_div);
   
        let equipment = document.getElementById(this.class);
        equipment.insertBefore(div, equipment.childNodes[0]);
    }

    async setEquipmentAttributes() {
        let skills = Object.fromEntries(this.slot.skills.map(skill => [skill, 0]));

        for (let slot in this.slot.slots) {
            let item_id = await this.player.get(this.slot.slots[slot]);
            
            if ( item_id != '' ) {
                let item_parameters = await this.player.config.items[item_id];
                // console.log(this.player.config.items);
                // console.log(item_parameters);
                // console.log(item_id);
                let item_attributes = JSON.parse(item_parameters.attributes);

                for (let attribute in item_attributes) {
                    skills[attribute] += item_attributes[attribute];
                }
            }
        }

        delete skills.level;
        
        // for (let skill in skills) {
        //     await this.player.set(skill, skills[skill]);
        // }
    }

    async addPlayerEquipment(id) {
        let item = this.items[id];
        let slot = document.querySelector(`.slot_${item.category}_${item.slot} .socket`);
        slot.style.backgroundImage = `url('${this.config.images} /${item.category}/${item.slot}.png')`;
        
        this.setEquipmentAttributes();
    }
}