//
// Scripts
// --------------------------------------------------

import '../css/style.css';

import { Config } from './config'
import { Socket } from './socket'
import { Functions } from './functions'
import { Shader } from './DisplayEngine/shader'
import { Map } from './map'
import { Keyboard } from './keyboard'
import { Player } from './player'
import { Events } from './events'
import { Online } from './online'

async function main() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('player') ?? '1';

    const config = new Config();
    await config.itemsInit();

    const socket = new Socket(config);
    await socket.connector();

    const player = new Player(id, config, socket);
    await player.init();

    const online = new Online(config, player, socket);
    await online.login(); 

    const display = new Shader(config);
    await display.init();

    const map = new Map(config, online, player);
    await map.init();

    const functions = new Functions(config, player);
    await functions.init();

    const keyboard = new Keyboard(config, socket, display, player);
    //await keyboard.init();

    //
    const events = new Events(config, socket, player, online, map);
    await events.serverCommands();
    //
}

main();