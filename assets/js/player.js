import { PlayerCanvas } from './playerCanvas'
import { PlayerEquipment } from './playerEquipment'
import { vec3 } from 'gl-matrix';

class Player {
  constructor(id, config, socket_id){
    this.config = config;
    this.id = id;
    this.params = [];
    this.canvas;
    this.equipment;
    this.socket_id = socket_id;
    this.position = vec3.fromValues(0, 0, 0);
  }

  async init() {
    if ( this.params.length == 0 ) {
      this.params = await this.getPlayerQuery();

      this.canvas = new PlayerCanvas(this);
      await this.canvas.init();

      this.equipment = new PlayerEquipment(this, this.config.items);
      await this.equipment.init();
    }
  }

  async getPlayerQuery() {
    const sql = `SELECT players.*, skills.*, equipment.*, games.* FROM players
                  LEFT JOIN games ON players.game_id = games.id 
                  LEFT JOIN skills ON players.id = skills.player_id
                  LEFT JOIN equipment ON players.id = equipment.player_id 
                  WHERE players.id = ${this.id}`;

    return await this.config.db.query(sql, true);
  }

  newPlayerPos(player_pos) {
    this.set('x', player_pos.x);//(speed * x) + player_pos.x);
    this.set('y', player_pos.y);//(speed * y) + player_pos.y);
    this.set('z', player_pos.z);//(speed * y) + player_pos.y);
  }

  async getPlayerPos()
  {
    let player_x = await this.get('x');
    let player_y = await this.get('y');
    let player_z = await this.get('z');

    return {x: player_x, y: player_y, z: player_z};
  }

  async getCanvas()
  {
    return await this.canvas;
  }


  async get(parameter)
  {
    return await this.params[parameter];
  }

  set(parameter, value)
  {
    this.params[parameter] = value;
  }
}

export { Player }