class Animal
{
	name;
	art;
	isHealing = false;
	isBear = false;
	clicked = false;
	createdAt;

	constructor(art, isHealing, isBear)
	{
		this.name = art.texture.key;
		this.art = art;
		this.isHealing = isHealing;
		this.isBear = isBear;
		this.createdAt = (new Date()).getTime();
		this.clicked = false;
	}
}