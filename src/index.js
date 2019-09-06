import * as PIXI from 'pixi.js'

import Player from './Player';
import EnemyGroup from './EnemyGroup';
import Blood from './Blood';
import Lives from './Lives';


const width = 800, height = 600;

EnemyGroup.stageWindth = width;
EnemyGroup.stageHeight = height;

const app = new PIXI.Application({
    width, height, backgroundColor: 0x1099bb, resolution: 1,
});
document.body.appendChild(app.view);

const {stage, loader} = app;

/**

    DEBUG VARIABLES
**/

let bulletsDebugInfoField = new PIXI.Text('', {fill : 'red'});
// stage.addChild(bulletsDebugInfoField);
/**

    DEBUG VARIABLES END
**/


let player,
    isGameOver = false,
    mv = new PIXI.Point(), isShot = false,
    bullets = [], enemies = [], eg, livesController, lives = 3;

stage.field = new PIXI.Container();
stage.addChild(stage.field);
stage.ui = new PIXI.Container();
stage.addChild(stage.ui);

loader
    .add('player', 'assets/player.png')
    .add('enemy', 'assets/enemy2.png')
    .add('enemy1', 'assets/enemy2_1.png')
    .add('blood', 'assets/anim_blood_atlas.png')
    .add('hearts', 'assets/hearts.png')
    .load((loader, resources)=>{
        Blood.setTextureInfo(resources.blood.texture, 4, 4);

        livesController = new Lives(resources.hearts.texture, 3, 1, lives );
        livesController.x  = 10;
        livesController.y  = 7;

        window.lives = livesController;
        stage.ui.addChild(livesController);


        eg = new EnemyGroup(
            [
                resources.enemy.texture,
                resources.enemy1.texture
            ], 
            false);
        eg.attach(stage.field);
        enemies = [...enemies, ...eg.units];

        //creating player

        player = new Player(resources.player.texture);
        stage.field.addChild(player);

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

           if (isGameOver) return;

            let isBulletsFilteringNeeded = false,
                isEnemiesFilteringNeeded = false;

            player.x += player.speed * delta * mv.x;
            if (player.x < 0) player.x = 0;
            if (player.x > width) player.x = width;


            //update enemies 
            eg.update(delta);


            //cache enemies boundaries 
            let enemiesBoundaries = enemies.map( enemy => {
                enemy.calculateBounds();
                return enemy.getBounds();
             });

            for (let i = 0, len = bullets.length; i < len; i++){
                let bullet = bullets[i];
                bullet.update(delta);

                //check if bullet if out of stage 
                if (bullet.y < 0){
                    isBulletsFilteringNeeded = true;
                    bullet.destroy();
                } else {

                    //check player bullets collision with enemy
                    if (bullet.direction === -1){ // direction -1 means that this is player's bullet 
                        for (let j = 0, jlen = enemiesBoundaries.length; j < jlen; j++)
                        {

                            //check if this enemy still exists 
                            if (enemies[j]._destroyed) continue;

                            bullet.calculateBounds();

                            let enemyBoundary = enemiesBoundaries[j],
                                bulletBoundary = bullet.getBounds();

                            if (isOverlap(enemyBoundary, bulletBoundary))
                            {
                                isBulletsFilteringNeeded = true;
                                bullet.destroy();

                                let enemyPos = enemies[j].getGlobalPosition();
                                onEnemyDestroy(enemyPos);
                                enemies[j].destroy();
                                isEnemiesFilteringNeeded = true;

                                break;
                            }
                        }
                    }
                }
            }


            //check if enemy touched the player

           player.calculateBounds();
           let playerBounds =  player.getBounds();
           for (let i = 0; i < enemiesBoundaries.length; i++){
               if (enemies[i]._destroyed) continue;

               let enemyBoundary = enemiesBoundaries[i];

               if (isOverlap(playerBounds, enemyBoundary)){
                   enemies[i].destroy();
                   isEnemiesFilteringNeeded = true;
                   onEnemyAndPlayerCollided();
               } else if (enemyBoundary.y > height){
                   enemies[i].destroy();
                   isEnemiesFilteringNeeded = true;
                   onEnemyPassed();
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
    stage.field.addChild(bullet);
    bullets.push(bullet);
}

function onEnemyAndPlayerCollided() {
    isGameOver = true;
}

function onEnemyPassed() {

}

function onEnemyDestroy(position){
    let blood = new Blood();
    blood.x = position.x - 50;
    blood.y = position.y - 20;
    stage.field.addChild(blood);
}


function playBloodAnimation(position){

}


function isOverlap(ab, bb) 
{
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

