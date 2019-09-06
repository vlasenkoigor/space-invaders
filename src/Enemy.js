import {AnimatedSprite} from 'pixi.js'
import Bullet from './Bullet'


class Enemy extends AnimatedSprite{


constructor(...params){
        super(...params);
        this.animationSpeed = 0.1;
        this.play();

       
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