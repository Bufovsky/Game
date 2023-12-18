export class Events {
    constructor(config, socket, player, online, map){
        this.config = config;
        this.player = player;
        this.socket = socket;
        this.online = online;
        this.map = map
    }

    async serverCommands()
    {
        /**
         * Aktualizacja pozycji gracza
         */
        this.socket.conn.on("updatePlayerPos", async function(array) {
            let player_id = array.id;
            let current_player_id = this.player.id;

            if (this.checkIsPlayerOnScreen(array.value)) { return; }
            
            if ( player_id != current_player_id) {
                let player = this.online.players[player_id];
                // console.log('player');
                // console.log(player);
                // console.log('player_object');
                // console.log(await player_object.socket_id);
                let current_pos = await this.player.getPlayerPos();
                //let player = await this.online.players[player_id];

                if ( player == undefined ) { return; }

                let player_pos = {x:array.value.x, y:array.value.y, direction:array.value.direction};
                let other_player_pos = await player.canvas.getOtherPlayerPos(current_pos, player_pos);
                await player.newPlayerPos(other_player_pos);
                await player.canvas.drawPlayer(array.value);
            }
            
        }.bind(this));

        this.socket.conn.on("playerLogin", async function(value) {
            //let player_id = await this.player.get('id');

            //if ( value.id != player_id) {
                await this.online.playerLogin(value);
            //}
        }.bind(this));

        this.socket.conn.on("playerLogout", function(value) {
            this.online.playerLogout(value);
        }.bind(this));

        this.socket.conn.on("equipPlayer", function(value) {
            // this.online.playerLogout(value);
        }.bind(this));
    }

    
    checkIsPlayerOnScreen(value) {
        if ( 
            value.x <= -this.config.outfit.width || 
            value.y <= -this.config.outfit.height ||
            
            value.x >= (this.config.outfit.width + this.config.canvas.width) ||
            value.y >= (this.config.outfit.height + this.config.canvas.height)
        ) {
            return true;
        }

        return false;
    }
}
