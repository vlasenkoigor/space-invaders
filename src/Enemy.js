import {Sprite} from 'pixi.js'
import Bullet from './Bullet'


class Enemy extends Sprite{


constructor(...params){
        super(...params);
        this.anchor.set(.5);
    }


    shoot(){
    	let bullet = new Bullet(1);
    	bullet.x = this.x - bullet.width / 2;
    	bullet.y = this.y + this.height / 2 + bullet.height;


    	return bullet;

    }

    get speed(){

        return 3;
    }



}



export default Enemy;