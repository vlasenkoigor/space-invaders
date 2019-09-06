import {AnimatedSprite, Texture, Rectangle, Container} from 'pixi.js'

let frames = [];
class Lives extends Container{


	constructor(texture = null, colls = 1, rows = 0, lives = 1){

		super();

		const  {width, height} = texture,
			  fw = width / colls,
			  fh = height / rows;	

		for (let j = 0; j<rows; j++){
			for (let i = 0; i<colls; i++){
				frames.push(new Texture(texture, new Rectangle(i * fw, j * fh, fw, fh) ));
			}
		}
		this.items = this._createItems(lives)
	}

	_createItems(lives){
		let items = [];
		for (let i = 0; i<lives; i++){
			let item = new AnimatedSprite(frames);
			item.gotoAndStop(0);
			item.x = item.width * i;
			items.push(item);
			this.addChild(item);
		}

		return items;
	}


	setLives(lives){
		for (let i = 0; i<this.items.length; i++){
			if (lives >= i+1){
				this.items[i].gotoAndStop(0);
			} else if (lives > i){
				this.items[i].gotoAndStop(1);
			} else {
				this.items[i].gotoAndStop(2);
			}
		}
	}



}


export default Lives;