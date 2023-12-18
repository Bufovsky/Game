import { Player } from './player'

export class Online {
    constructor(config, player, socket){
        this.players = [];
        this.player = player;
        this.config = config;
        this.socket = socket;
        this.interval;
        this.socket_online;
    }

    getPlayers()
    {
        return this.players.filter(item => !!item);
    }

    // setPlayer(id, value)
    // {
    //     this.players[id] = value;
    // }

    async login()
    {
        await this.socket.queue('playerLogin', {"id": this.player.id});
        let set_online = await this.setPlayerOnline(this.player.id, 1);
    }

    async setPlayerOnline(id, value) {
      const sql = `UPDATE players SET online = ${value} WHERE id = ${id};`;
  
      return await this.config.db.query(sql);
    }

    async playerLogin(value)
    {
        //console.log(value);
        // let player = new Player(value.id, this.config, value.socket_id);
        // await player.init();
        //let player_pos = await this.player.getPlayerPos();
        // this.players[value.id] = player;
        // console.log(this.players);
        await this.setPlayersOnline(value.online);
        //this.interval = await setInterval(async function() { await this.setPlayersOnline(value.online) }.bind(this), 100);
    }

    async playerLogout(value)
    {
        // let socket_id = {socket_id: value.socket_id};
        // let players_online = this.getPlayers();
        let player = await this.findPlayer('socket_id',value.socket_id);
        
        if ( player == null ) { return; }

        let player_id = this.player.id;
        player.canvas.canvas_obj.removeCanvas(`.player_${player_id}`);
        this.players.splice(player_id, 1);

        
        let set_online = await this.setPlayerOnline(player_id, 0);
    }

    async setPlayersOnline(players)
    {
        let current_pos = await this.player.getPlayerPos();

        // console.log('setOnline');
        Object.keys(players).forEach(async key => {
            const value = players[key];
            let players_online = this.getPlayers();

            if ( value.id != this.player.id) {
                if (value.id in players_online) {return;}

                let player = new Player(value.id, this.config, value.socket_id);
                await player.init();
                let other_player_pos = await player.getPlayerPos();
                let player_pos = await player.canvas.getOtherPlayerPos(current_pos, other_player_pos);
                console.log(player.context);
                console.log(player.canvas);
                player.canvas.canvas_obj.reload(player.canvas.context, player.canvas.canvas);
                await player.canvas.drawPlayer(current_pos, player_pos);
                this.players[value.id] = player;
            }
        });
    }

    async updatePlayersOnlinePos() {
        let players = this.getPlayers();
        let current_pos = await this.player.getPlayerPos();

        // console.log('PLAYER ONLINE');
        // console.log(players);

        Object.values(players).forEach(async (player) => {        
            let this_player_id = await this.findPlayer(player.socket_id);
            // console.log('PLAYER ID');
            // console.log(player.id);
            // console.log(this.players);
            // console.log(player.socket_id);
            // console.log(this_player_id);
            if ( player.id != this_player_id) {
                // console.log('PLAYER ONLINE');
                // console.log(player.id);
                // console.log(this_player_id);
                // console.log(player);
                // console.log(current_pos);
                let player_pos = await player.getPlayerPos();
                // console.log(player_pos);
                let other_player_pos = await player.canvas.getOtherPlayerPos(current_pos, player_pos);
                await player.canvas.drawPlayer(other_player_pos);
            }
        });
    }

    async findPlayer(type, value) {
        value = [value];
        let players = await this.getPlayers();
        const player = players.find(player => player && value.includes(player[type]));

        return player || null;
    }

    async get(parameter)
    {
      return await this[parameter];
    }
}