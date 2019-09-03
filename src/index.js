import * as PIXI from 'pixi.js'

import Player from './Player';
import Bullet from './Bullet';

const width = 800, height = 600;

const app = new PIXI.Application({
    width, height, backgroundColor: 0x1099bb, resolution: 1,
});
document.body.appendChild(app.view);

const {stage, loader} = app;

let player,
    mv = new PIXI.Point(), isShot = false,
    bullets = [];


let bullet = new Bullet();
window.bullet = bullet;
bullet.x = width / 2;
bullet.y = height - 100;

bullets.push(bullet);

stage.addChild(bullet);
loader
    .add('player', 'assets/player.png')
    .load((loader, resources)=>{

        //creating player

        player = new Player(resources.player.texture);
        stage.addChild(player);

        player.x = width / 2;
        player.y = height - player.height;


        window.addEventListener("keydown", event => {
            switch (event.keyCode) {
                case 37:
                    mv.set(-1, 0); break; //move left
                case 39:
                     mv.set(1, 0); break; //move right
                case 32:
                    if (!isShot) {isShot = true; console.log('shot'); } break; //shoot

                default : break;
            }
        });

        window.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 37:
                    mv.set(0, 0); break; //move left
                case 39:
                    mv.set(0, 0); break; //move right
                case 32:
                    isShot = false; break; //shoot
                default : break;
            }
        });


        // Listen for animate update
        app.ticker.add((delta) => {
            player.x += player.speed * delta * mv.x;

            for (let i = 0, len = bullets.length; i < len; i++){
                bullets[i].update(delta)
            }
        });

    });