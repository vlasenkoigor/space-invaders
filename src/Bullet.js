import {Graphics} from 'pixi.js';

class Bullet extends Graphics{

    constructor(...params){
        super(...params);

        this._bulletWidth = 2;
        this._bulletHeight = 5;

        this._speed  = 10;

        this._drawBullet();
        this.cacheAsBitmap = true;

    }


    _drawBullet(){
        this.beginFill(0xffffff);
        this.drawRect(0,0,this._bulletWidth, this._bulletHeight);
        this.endFill();
    }


    update(delta = 16){
        this.y -= (this._speed * delta)

    }

}




export default Bullet;