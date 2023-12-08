class BearPoke //implements BearPokeInterface
{
	scene;
	maxHearts;
	hearts;
	drawLimit;
	lastPoke;
	startTime;
	stoppedTime;

	animals;
	score;
	pokes;
	bearPokes;
	healingAnimals;
	isGameOver;
	timerArtWidth;

	heartArt;
	heartContainer;
	scoreCard;
	timerArt;

	constructor()
	{
		this.maxHearts = 3;
		this.hearts = this.maxHearts;
		this.pokes = 0;
		this.bearPokes = 0;
		this.healingAnimals = 0;
		this.timerArtWidth = 0;
		this.lastPoke = (new Date()).getTime();
		this.startTime = this.lastPoke;
		this.stoppedTime = 0;
		this.drawLimit = 3;
		this.animals = [];

		this.isGameOver = false;
		this.score = 0;

		this.heartArt = [];
		this.heartContainer = [];
	}
	shared()
	{
		return BearPoke.shared();
	}

	static shared()
	{
		let shared = SharedBP;
		if (!shared)
		{
			shared = BearPoke.newGame();
			SharedBP = shared;
		}
		return shared;
	}

	static newGame()
	{
		SharedBP = new BearPoke();
		return BearPoke.shared();
	}

	didntPokeAnything()
	{
		let shared = BearPoke.shared();
		shared.hearts = Math.max(0, shared.hearts - 1);
		shared.lastPoke = (new Date()).getTime();
	}

	poked(animal)
	{
		if (animal.poked) return;
		animal.poked = true;
		let name = animal.texture.key;
		if (name === 'bear')
		{
			this.bearPokes += 1;
		} else {
			this.pokes += 1;
		}
		switch (name)
		{
			case 'fish':
				this.hearts += 1;
				if (this.hearts > this.maxHearts) this.hearts = this.maxHearts;
				this.score += 1;
				this.healingAnimals += 1;
				break;
			case 'duck':
			case 'snek':
				this.score += 2;
				break;
			case 'sloth':
				this.score += 3;
				break;
			case 'deer':
				this.score += 5;
				break;
			case 'bear':
				this.hearts -= 2;
				if (this.hearts < 1) this.hearts = 0;
				break;
			default: break;
		}
	}
}
SharedBP = new BearPoke();
