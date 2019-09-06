
import {Point, Container} from 'pixi.js'

import Enemy from './Enemy';

let stageWindth, stageHeight;

class EnemyGroup extends Container{


	constructor(textures = [], initialInVisible = true){
		super();
		this.conf = {
			enemies_N : 10,
            hGap : 10,
            vGap : 10
		}

		this.dir = new Point(1, 1);

		this.speed = new Point(2,0);

		this.lap = 0;

		this._units = [];

		this._spawn(textures);

		if (initialInVisible){

			this.y -= this.height;
		}
		this.contentWidth = this.width;
		this.y -=(this.height - 155);

	}


	_spawn(textures = []){

		let {enemies_N,
            hGap,
            vGap}  = this.conf;

        for (var i = 0; i < 30; i++) {
            let enemy = new Enemy(textures);
            
            enemy.x = (i % enemies_N) * (enemy.height + vGap) ;
            enemy.y = Math.floor(i / enemies_N) * (enemy.height + hGap);

            this._units.push(enemy);
            this.addChild(enemy);
        }

	}


	attach(root){
		root.addChild(this);
	}

	update(delta){
		this.x += delta * this.speed.x * this.dir.x;
		this.y += delta * this.speed.y * this.dir.y;

		if (this.x + this.contentWidth >= stageWindth){

			this.x = stageWindth - this.contentWidth;
			this.dir.x *=-1;

			let prevLap = this.lap++;
			this.onLapCompleted(prevLap);
		}

		if (this.x  <= 0){

			this.x = 0;
			this.dir.x *=-1;
		
		}


	}

	onLapCompleted(prevLap){
		if (this.lap < 2){

			this.speed.x += .8
		} else {

			this.speed.x += .5;
		}
		
		this.speed.y += .07;	
	}


	get units(){
		return this._units;
	}

	static set stageWindth(w){
		stageWindth = w;
	}


	static set stageHeight(h){
		stageHeight = h;
	}
}


export default EnemyGroup;
