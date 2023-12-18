import { glMatrix, vec3, mat4 } from 'gl-matrix';

export class Keyboard {
    constructor(config, socket, display, player) {
        this.config = config,
        this.socket = socket,
        this.display = display,
        this.player = player,
        this.camera = {
            position: vec3.fromValues(0, 0, -5),
            target: vec3.fromValues(0, 0, 0),
            up: vec3.fromValues(0, 1, 0),
            pitch: 0,
            yaw: 0,
            speed: 1,
            rotationSpeed: 0.02
        };

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }


    handleMouseMove(event) {
        // Rotate camera based on mouse movement
        const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.camera.yaw += deltaX * this.camera.rotationSpeed;
        this.camera.pitch += deltaY * this.camera.rotationSpeed;

        // Clamp pitch to avoid flipping
        this.camera.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.pitch));

        this.updateCamera();
    }

    handleKeyDown(event) {
        // Move camera based on WASD keys
        switch (event.key) {
            case "w":
              playerY += movementSpeed;
              break;
            case "s":
              playerY -= movementSpeed;
              break;
            case "a":
              playerX -= movementSpeed;
              break;
            case "d":
              playerX += movementSpeed;
              break;
          }
  
        this.updateCamera();
    }

    updateCamera() {
        const viewMatrix = mat4.create();

        console.log('position');
        console.log(this.camera.position);
        console.log('target');
        console.log(this.camera.target);
        console.log('position');
        console.log(this.camera.up);

        mat4.lookAt(viewMatrix, this.camera.position, this.camera.target, this.camera.up);
        
        // Apply pitch and yaw rotations
        mat4.rotateX(viewMatrix, viewMatrix, this.camera.pitch);
        mat4.rotateY(viewMatrix, viewMatrix, this.camera.yaw);

        // Update uniforms with the new view matrix
        const uModelViewMatrix = this.display.context.getUniformLocation(this.display.shaderProgram, 'uModelViewMatrix');
        this.display.context.uniformMatrix4fv(uModelViewMatrix, false, viewMatrix);
        
        // Render the scene
        this.display.drawScene();
    }

    getCameraForward() {
        const forward = vec3.create();
        vec3.subtract(forward, this.camera.target, this.camera.position);
        vec3.normalize(forward, forward);
        return forward;
    }

    getCameraRight() {
        const right = vec3.create();
        vec3.cross(right, this.getCameraForward(), this.camera.up);
        vec3.normalize(right, right);
        return right;
    }
}





// constructor(config, socket, player, map, online, functions){
//     this.config = config;
//     this.socket = socket;
//     this.player = player;
//     this.functions = functions;
//     this.map = map;
//     this.online = online;
//     this.canvas;
//     this.interval = {};
//     this.keys = {};
//     this.player_info = {};
// }

// async init()
// {
//     await this.movement();
//     await this.keyboard();

//     this.canvas = await this.player.getCanvas();
//     this.player_info.pos = await this.player.getPlayerPos();
//     this.player_info.speed = await this.player.get('speed');
//     this.player_info.id = await this.player.id;
//     this.player_info.socket = await this.player.socket_id;

//     this.interval = await setInterval(await this.updateGameArea.bind(this), 20);
// }

// async keyboard()
// {
//     let player = await this.player;
//     let functions = await this.functions;

//     $('body').keydown( async function( key ) {
//         key.preventDefault();
//         console.log(key.code);

//         switch ( key.code ) {
//             case "KeyE": 
//                 await player.equipment.slot.switch('right');
//                 break;
//             case "KeyC": 
//                 await functions.armory.slot.switch('left');
//                 break;
//             case "KeyX": 
//                 this.pauseMovement();
//                 break;
//             case "KeyZ": 
//                 await this.startMovement();
//                 break;
//         }
//     }.bind(this));
// }

// async movement()
// {
//     window.addEventListener("keydown", (e) => {
//         e.preventDefault();
//         this.keys[e.keyCode] = e.type === "keydown";
//     });

//     window.addEventListener("keyup", (e) => {
//         delete this.keys[e.keyCode];
//     });
// }

// pauseMovement() {
//     clearInterval(this.interval);
// }

// async startMovement() {
//     this.interval = await setInterval(await this.updateGameArea.bind(this), 20);
// }

// async updateGameArea() {
//     if ( Object.keys(this.keys).length == 0 ) { return; }



//     this.canvas.canvas_obj.reload(this.canvas.context, this.canvas.canvas);
//     let tmp = {"x": this.player_info.pos.x, "y": this.player_info.pos.y, "direction": this.player_info.pos.direction};

//     if (this.keys[37]) {
//         this.player_info.pos.direction = 'left';
//         this.player_info.pos.x -= 1 * this.player_info.speed;
//     }
//     if (this.keys[39]) {
//         this.player_info.pos.direction = 'right';
//         this.player_info.pos.x += 1 * this.player_info.speed;
//     }
//     if (this.keys[38]) {
//         this.player_info.pos.direction = 'up';
//         this.player_info.pos.y -= 1 * this.player_info.speed;
//     }
//     if (this.keys[40]) {
//         this.player_info.pos.direction = 'down';
//         this.player_info.pos.y += 1 * this.player_info.speed;
//     }

//     // if ( this.map.stepable.checkIsStepable(this.player_info.pos) ) {
//     //     this.player_info.pos = tmp;
//     // }

//     let new_player_pos = {"x": this.config.canvas.x, "y": this.config.canvas.y, "direction": this.player_info.pos.direction};
//     let queue_info = {"id": this.player_info.id, "value": this.player_info.pos};
//     this.player.newPlayerPos(this.player_info.pos);
//     this.socket.queue('updatePlayerPos', queue_info);
//     this.map.drawMap(this.player_info.pos);
//     this.canvas.drawPlayer(new_player_pos);
//     await this.online.updatePlayersOnlinePos();
// }