import {Sprite} from 'pixi.js'

class Player extends Sprite{

    constructor(...params){
        super(...params);
        this.anchor.set(.5);
    }

    get speed(){

        return 10;
    }
}

export default Player;