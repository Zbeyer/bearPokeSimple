let IsDebug = false;
class MainGame extends Phaser.Scene
{
	preload ()
	{ }

	create ()
	{
		BearPoke.newGame();
		const frameRate = 60.0;

		// let shared = BearPoke.shared();
		let scene = this;
		let shared = BearPoke.shared();
		let bg = new BG(this).backgroundImage;

		let scorecardBG = this.add.rectangle(0, 0, 180, 24, 0x000000);
		scorecardBG.setOrigin(0, 0);
		scorecardBG.alpha = 0.667;

		let scoreCard = this.add.text(4, 4, 'Score: 0', { color: '#FFFFFF' });
		scoreCard.setOrigin(0, 0);
		shared.scoreCard = scoreCard;

		let heartsBg = this.add.rectangle(0, this.cameras.main.height - 32,
			shared.hearts * 32, 32,
			0x000000);
		heartsBg.setOrigin(0, 0);
		heartsBg.alpha = 0.667;
		for (let i = 0; i < shared.hearts; i++)
		{
			let newHeartArt = scene.add.image(16 + i * 32, this.cameras.main.height - 16, 'heartFull').setScale(3.0);
			shared.heartArt.push(newHeartArt);
		}

		let hArt = shared.heartArt;
		let length = hArt.length
		for (let i = 0; i < length; i++)
		{
			let heart = hArt[i];
			let container = scene.add.image(heart.x, heart.y, 'heartEmpty').setScale(3.0);
			shared.heartContainer.push(container);
		}

		let timerBG = scene.add.rectangle(heartsBg.x + heartsBg.width, heartsBg.y, scene.cameras.main.width - heartsBg.width, heartsBg.height, 0x000000);
		timerBG.setOrigin(0, 0);
		shared.timerArtWidth = timerBG.width;

		let timer = scene.add.rectangle(timerBG.x, timerBG.y, shared.timerArtWidth, timerBG.height, 0xFFCC00);
		timer.setOrigin(0, 0);
		shared.timerArt = timer;
		let gameLoop = setInterval(function () {
			if (scene)
			{
				scene.draw(scene);
				scene.drawTimer(scene);
				if (BearPoke.shared().isGameOver)
				{
					clearInterval(gameLoop);
				}
			}
		}, 1000 / frameRate);
	}

	drawText(scene, text)
	{
		if (!text) return;
		const x = 8;
		const y = scene.cameras.main.height - 80;
		let textColor = "#FFFFFF";

		let textArt = scene.add.text(x, y, text, { fontFamily:'verdana', color: textColor });
		textArt.setOrigin(0, 0);
		// textArt.setShadow(0, 0, '#000000', 2, true, true);
		// textArt.setAlpha(0.8)
		if (text == 'bear')
		{
			text = 'Don\'t poke the bear!';
			// textColor = '#FF5555';
			// textArt.setColor(textColor);
		}
		else
		{
			text = 'Poke the ' + text + '!';
		}
		text = text.toUpperCase();
		textArt.setText(text);
		textArt.scale = 2.0;

		const decayTime = 1_000;
		let decayTween = scene.tweens.add({targets: textArt, alpha: 0.0, ease: 'Power1', delay:decayTime * 0.5, duration: decayTime});
		decayTween.on('complete', function () {
			textArt.destroy();
		});

		return textArt;
	}

	drawPokeDust(scene, x, y)
	{
		const key = 'pokeDust';
		const lifeTime = 750;
		// let emitter = new Phaser.Events.EventEmitter();
		let emitter = scene.add.particles(x, y, key,
			{
			scale: { min: 2.0, max: 6.0 },
			speed: { min: 30, max: 80 },
			alpha: { start: 1, end: 0 },
			lifespan: lifeTime,
			frequency: 50,
			gravityY: -210,
			particleBringToTop: true,
		});

		let timeoutStopEmitting = setTimeout(() => {
			emitter.stop();
			clearTimeout(timeoutStopEmitting);
			// timeout = null;
		}, lifeTime);

		let timeoutDestroy = setTimeout(() => {
			emitter.destroy();
			clearTimeout(timeoutDestroy);
			// timeout = null;
		}, lifeTime * 3.0);
	}

	update ()
	{
		let shared = BearPoke.shared();
		if (shared.hearts < 1)
		{
			shared.stoppedTime = (new Date()).getTime();
			shared.isGameOver = true;
			const lingerTime = 1_250;
			let timeoutDestroy = setTimeout(() => {
				this.scene.start('GameOver');
				this.scene.stop('MainGame');
				clearTimeout(timeoutDestroy);
				// timeout = null;
			}, lingerTime);
			let scoreCard = shared.scoreCard || this.add.text(16, 16, 'Score: 0', { color: '#FFFFFF' });;
			scoreCard.setText([
				'score: ' + shared.score,
			]);
		}
	}

	animals() {
		const animals = ['duck', 'snek', 'deer'];
		return animals;
	}

	healingAnimals() {
		const animals = ['fish'];
		return animals;
	}

	drawTimer(scene)
	{
		let shared = BearPoke.shared();
		if (shared.isGameOver) return;

		const timerLifeTime = IsDebug ? 18_000 : 2_600;

		let now = new Date().getTime();
		let lastPoke = BearPoke.shared().lastPoke || now;
		if (lastPoke == 0) return;
		let timeDelta = now - lastPoke;
		if (shared.hearts < 1) return;

		let lifeRatio = 1.0 - (timeDelta / timerLifeTime);
		let pokeTimerWidth = lifeRatio * shared.timerArtWidth;
		let timer = shared.timerArt || scene.add.rectangle(0, 0, pokeTimerWidth, 64, 0xFFCC00);
		timer.width = pokeTimerWidth;

		let heartsBeforeNotPoking = shared.hearts;
		if (timeDelta >= timerLifeTime) BearPoke.shared().didntPokeAnything()
		let heartsAfterNotPoking = shared.hearts;

		let heartDelta = heartsAfterNotPoking - heartsBeforeNotPoking;
		if (heartDelta < 0)
		{
			let heart = shared.heartArt[shared.heartArt.length - 1];
			let dropHeart = scene.add.tween({targets: heart, scale: 0.0, alpha: 0.0, y:heart.y + heart.height, ease: 'Power1', duration: 250});
			dropHeart.on('complete', function () {
				heart.destroy(); // Time drops a heart
				shared.heartArt.pop();
			});
		}
	}

	draw(scene)
	{
		let children = scene.children.list;
		let images = children.filter(function (child) {
			return child.texture && child.texture.key;
		});
		const animalNames = scene.animals().concat(scene.healingAnimals()).concat(['bear']);
		let animals = images.filter(function (image) {
			return animalNames.includes(image.texture.key);
		});

		let shared = BearPoke.shared();
		if (animals.length >= shared.drawLimit) return;
		if (shared.isGameOver) return;
		if (shared.drawLimit < 1) return;

		let seed = Math.random()
		let animalLifeTime = IsDebug ? 10_000 : 1_000 * seed + 800;
		seed = seed * 2_000;

		const scaleFactor = 8.00;
		const sizeOfSprite = 8 * scaleFactor;

		const widthMin = sizeOfSprite;
		const widthMax = scene.cameras.main.width - sizeOfSprite * 2.0;
		const heightMin = sizeOfSprite;
		const heightMax = scene.cameras.main.height - sizeOfSprite * 2.0;
		const appearanceTime = 250;
		let x = widthMin + seed % widthMax * 0.75 + widthMax * 0.125;
		let y = heightMin + seed % heightMax * 0.75 + widthMax * 0.125;
		let newAnimalIndex = Math.floor(seed % animalNames.length);
		let newAnimalName = animalNames[newAnimalIndex];
		let newArt = scene.add.image(x, y, newAnimalName);
		newArt.alpha = 0.0; newArt.setScale(0.0);
		newArt.setInteractive();

		// Make sure we are always tracking the animals...
		let appear = scene.tweens.add({targets: newArt, scale: scaleFactor, alpha: 1.0, ease: 'Power1', duration: appearanceTime });
		appear.on('complete', function () {
			newArt.setScale(scaleFactor);
			newArt.alpha = 1.0;
			appear.remove();

			let disappear = scene.tweens.add({targets: newArt, scale: 0.0, alpha: 0.0, ease: 'Power1', duration: appearanceTime, delay: animalLifeTime});
			disappear.on('complete', function () {
				disappear.remove();
				newArt.destroy();
			});
		});

		scene.input.on('gameobjectdown', function (pointer, gameObject)
		{
			let disappearNow = scene.tweens.add({ targets: gameObject, scale: 0.0, alpha: 0.0, ease: 'Power1', duration: appearanceTime});
			scene.drawPokeDust(scene, gameObject.x, gameObject.y);
			scene.drawText(scene, gameObject.texture.key);
			disappearNow.on('complete', function () {
				disappearNow.remove();
				if (BearPoke.shared().isGameOver) return;
				shared.lastPoke = (new Date()).getTime();
				let animal = gameObject;
				let poked = animal.poked || false;
				let heartsBeforePoke = BearPoke.shared().hearts;
				BearPoke.shared().poked(gameObject);
				if (poked) return;
				let heartsAfterPoke = BearPoke.shared().hearts;
				// a negative delta means we lost hearts
				// a positive delta means we gained hearts
				let delta = heartsAfterPoke - heartsBeforePoke;
				if (delta)
				{
					// let x = gameObject.x;
					// let y = gameObject.y;
					let count = Math.abs(delta);
					if (delta < 0)
					{
						for (let i = count; i > 0; i--)
						{
							let heart = shared.heartArt[shared.heartArt.length - 1];
							heart.destroy(); // Bear eats the hearts
							shared.heartArt.pop();
						}
					}
					else
					{
						let art = BearPoke.shared().heartArt[0];
						for (let i = count; i > 0; i--)
						{
							let index = shared.heartArt.length;
							let posX = index * 32 + 16;
							let newHeartArt = scene.add.image(posX, art.y, 'heartFull').setScale(3.0);
							shared.heartArt.push(newHeartArt); // Animal gives a heart
						}
						shared.heartContainer.forEach(function (container) {
							scene.children.bringToTop(container);
						});
					}
				}
				gameObject.destroy();
			});
		});
	}

}

