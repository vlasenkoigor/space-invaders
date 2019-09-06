import {AnimatedSprite, Texture, Rectangle} from 'pixi.js'

let texture = null, colls = 1, rows = 0;
class Blood extends AnimatedSprite{


	constructor(){

		let frames = [];
		const  {width, height} = texture,
			  fw = width / colls,
			  fh = height / rows;	

		for (let j = 0; j<rows; j++){
	
			for (let i = 0; i<colls; i++){
	
				frames.push(new Texture(texture, new Rectangle(i * fw, j * fh, fw, fh) ));


			}
		}


		super(frames);

		this.animationSpeed = 0.4;

		this.scale.set(0.8)

		this.loop = false;
		
		this.play();



		this.onComplete = ()=>{this.destroy()}

	}


	static setTextureInfo(t, c, r){
		texture = t;
		colls = c;
		rows = r;

	}
}


export default Blood;