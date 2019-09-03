import * as PIXI from 'pixi.js'

import Player from './Player';
import Enemy from './Enemy';


const width = 800, height = 600;

const app = new PIXI.Application({
    width, height, backgroundColor: 0x1099bb, resolution: 1,
});
document.body.appendChild(app.view);

const {stage, loader} = app;

/**

    DEBUG VARIABLES
**/

let bulletsDebugInfoField = new PIXI.Text('', {fill : 'red'});
stage.addChild(bulletsDebugInfoField);
/**

    DEBUG VARIABLES END
**/


let player,
    mv = new PIXI.Point(), isShot = false,
    bullets = [], enemies = [];

loader
    .add('player', 'assets/player.png')
    .add('enemy', 'assets/enemy.png')
    .load((loader, resources)=>{


        let enemies_N = 10,
            startX = 100, 
            startY = 100, 
            hGap = 10,
            vGap = 10;

        for (var i = 0; i < 30; i++) {
            let enemy = new Enemy(resources.enemy.texture);
            stage.addChild(enemy);
            
            enemy.x = startX +  (i % enemies_N) * (enemy.height + vGap) ;
            enemy.y = startY + Math.floor(i / enemies_N) * (enemy.height + hGap);

            enemies.push(enemy);
        }
     
    


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
                    if (!isShot) {isShot = true; shoot(); } break; //shoot

                default : break;
            }
        });

        window.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 37:
                    if (mv.x === -1 )mv.set(0, 0); break; //move left
                case 39:
                    if (mv.x === 1) mv.set(0, 0); break; //move right
                case 32:
                    isShot = false; break; //shoot
                default : break;
            }
        });


        // Listen for animate update
       app.ticker.add((delta) => {

            let isBulletsFilteringNeeded = false,
                isEnemiesFilteringNeeded = false;

            player.x += player.speed * delta * mv.x;
            if (player.x < 0) player.x = 0;
            if (player.x > width) player.x = width;




            //cache enemies boundaries 
            let enemiesBoundaries = enemies.map( enemy => {
                enemy.calculateBounds();
                return enemy.getBounds();
             });

            for (let i = 0, len = bullets.length; i < len; i++){
                let bullet = bullets[i] 
                bullet.update(delta);

                //check if bullet if out of stage 
                if (bullet.y < 0){
                    isBulletsFilteringNeeded = true;
                    bullet.destroy();
                } else {


                    //check player bullets colision with enemy
                    if (bullet.direction === -1){ // direction -1 means that this is player's bullet 
                        for (let j = 0, jlen = enemiesBoundaries.length; j < jlen; j++)
                        {

                            //check if this enemy still exists 
                            if (enemiesBoundaries[j]._destroyed) continue;

                            bullet.calculateBounds();

                            let enemyBoundary = enemiesBoundaries[j],
                                bulletBoundary = bullet.getBounds();

                            if (isOverlap(enemyBoundary, bulletBoundary))
                            {
                                isBulletsFilteringNeeded = true;
                                bullet.destroy();

                                enemies[j].destroy();
                                isEnemiesFilteringNeeded = true;

                                break;
                            }

                        }


                    }

                }

            }


            if (isBulletsFilteringNeeded) {
                bullets = bullets.filter(bullet => !bullet._destroyed)
            }

            if (isEnemiesFilteringNeeded) {
                enemies = enemies.filter(enemy => !enemy._destroyed)
            }

            //bullets debug info 
            bulletsDebugInfoField.text = 'Bullets: ' + bullets.length;
        }); 

    });


function shoot(){
    let bullet = player.shoot();
    stage.addChild(bullet);
    bullets.push(bullet);
}


function isOverlap(ab, bb) 
{
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

