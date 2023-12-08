let sharedkey = 'bg5';
class BG
{
	scene;
	key;
	backgroundImage;
	constructor(scene, key)
	{
		this.scene = scene;
		this.key = key || BG.sharedKey();
		let bg = this.scene.add.image(0, 0, this.key);
		bg.setOrigin(0, 0);
		bg.setScale(Math.max(scene.cameras.main.width / bg.width, scene.cameras.main.height / bg.height));
		const fx = bg.postFX?.addBlur(0, 0, 0, 8);
		this.backgroundImage = bg;
	}
	static sharedKey = function() {
		return sharedkey;
	}
	static setSharedKey = function(key) {
		sharedkey = key;
	}
}
