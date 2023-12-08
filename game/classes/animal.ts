export default class Animal
{
	name: string;
	art: Phaser.GameObjects.Image;
	isHealing: boolean = false;
	isBear: boolean = false;
	clicked: boolean = false;
	createdAt: number;

	constructor(art: Phaser.GameObjects.Image, isHealing: boolean = false, isBear: boolean = false)
	{
		this.name = art.texture.key;
		this.art = art;
		this.isHealing = isHealing;
		this.isBear = isBear;
		this.createdAt = (new Date()).getTime();
		this.clicked = false;
	}
}