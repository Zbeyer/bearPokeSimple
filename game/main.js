class BootScene extends Phaser.Scene
{
		create () { 
			this.game.scene.start('Preloader');
		}
}

class PreloadScene extends Phaser.Scene
{
		preload () {
			
		}
	
		create () {
			
		}
}

class MainMenu extends Phaser.Scene
{
	create ()
	{
		const bearPoke = BearPoke.shared();
		
		const title = 'Hello World';
		const menuWidth = 320;
		const menuHeight = this.cameras.main.height;
		const menuX = this.cameras.main.width - menuWidth;
		const menuY = 0;
		
		// const menuColor = 0xff33cc;
		const menuColor = 0x883300;
		
		let text = this.add.text(16, 16, title, { color: '#FFFFFF' })
		text.setBlendMode(Phaser.BlendModes.ADD);
		text.scale = 3.0;
		text.setText([
			'Don\'t',
			'Poke',
			'the',
			'Bear',
		]);
		
		let bg = new BG(this).backgroundImage;
		
		this.createAnimals();
		this.createHeart();
		
		const rectangle = this.add.rectangle(menuX, menuY, menuWidth, menuHeight, menuColor);
		rectangle.setOrigin(0, 0);
		rectangle.setBlendMode(Phaser.BlendModes.MULTIPLY);
		rectangle.setAlpha(0.50);
		
		this.createButtons(menuX, menuY, menuWidth);
	}
	
	createButtons(menuX, menuY, menuWidth)
	{
		const game = this.game;
		const scene = game.scene;
		let x;
		let y;
		
		const buttonOffsetX = 	8;
		const buttonOffsetY = 	8;
		const buttonWidth = menuWidth - buttonOffsetX * 2.0;
		const buttonScale = buttonWidth / 40; // the button image is 40px wide
		const buttonHeight = 76.0;
		let buttons = [];
		
		const texts = [
			'New Game',
			'Credits',
			'Quit',
		];
		const numButtons = 3;
		const indexNewGame = 0;
		const indexCredits = 1;
		const indexQuit = 2;
		
		for (let i = 0; i < numButtons; i++)
		{
			let button = this.add.image(menuX + buttonOffsetX, menuY + buttonHeight * i + buttonOffsetY * (i + 1), 'button');
			button.setOrigin(0, 0);
			button.setScale(buttonScale);
			button.setInteractive();
			buttons.push(button);
		}
		let index = 0;
		
		while (index < texts.length)
		{
			x = buttons[index].x + buttonOffsetX;
			y = buttons[index].y + buttonOffsetY;
			let text = this.add.text(x, y, texts[index], { color: '#000000' })
			text.scale = 2.25;
			
			switch (index)
			{
				case indexNewGame:
					buttons[index].on('pointerup', function (){
					scene.start('MainGame');
					scene.stop('MainMenu');
				}, this);
				break;
				case indexCredits:
					buttons[index].on('pointerup', function (){
						scene.start('Credits');
						scene.stop('MainMenu');
					});
				break;
				case indexQuit:
					buttons[index].on('pointerup', function (){
						scene.start('Quit');
						scene.stop('MainMenu');
					});
				break;
				default:
				break;
			}
			
			index++;
		}
	}
	
	createAnimals() {
		const offsetX = 64.0;
		const offsetY = 64.0;
		const animals = [
			this.add.image(offsetX, offsetY * 2.0, 'bear'),
			this.add.image(offsetX, offsetY, 'deer'),
			this.add.image(offsetX * 2.0, offsetY, 'duck'),
			this.add.image(offsetX * 3.0, offsetY, 'fish'),
			this.add.image(offsetX * 4.0, offsetY, 'snek')
			// this.add.image(offsetX * 5.0, offsetY, 'moose'),
			// this.add.image(offsetX * 6.0, offsetY, 'sloth'),
		];
		animals.forEach( function (animal) {
			animal.setScale(6.50);
			animal.setAlpha(0.25);
			animal.setBlendMode(Phaser.BlendModes.ADD);
		});
		return animals;
	}
	
	createHeart() {
		const heartOffsetX = 32;
		const heartOffsetY = 16;
		const yPosition = this.game.canvas.height - heartOffsetY;
		const hearts = [
			this.add.image(heartOffsetX * 0.50, yPosition, 'heartFull'),
			this.add.image(heartOffsetX * 1.25, yPosition, 'heartFull'),
			this.add.image(heartOffsetX * 2.00, yPosition, 'heartFull'),
		];
		
		const heartsStroke = [
			this.add.image(heartOffsetX * 0.50, yPosition, 'heartBlack'),
			this.add.image(heartOffsetX * 1.25, yPosition, 'heartBlack'),
			this.add.image(heartOffsetX * 2.00, yPosition, 'heartBlack'),
		];
		
		const heartsOutline = [
			this.add.image(heartOffsetX * 2.75, yPosition, 'heartEmpty'),
			this.add.image(heartOffsetX * 3.50, yPosition, 'heartEmpty'),
		];
		
		const scale = 3.0;
		
		hearts.forEach( function (heart) {
			heart.setScale(scale);
			heart.setBlendMode(Phaser.BlendModes.ADD);
		});
		
		heartsOutline.forEach( function (heart) {
			heart.setScale(scale);
		});
		
		heartsStroke.forEach( function (heart) {
			heart.setScale(scale);
			heart.setBlendMode(Phaser.BlendModes.MULTIPLY);
		});
		
		return hearts;
	}
};



class QuitScreen extends Phaser.Scene
{
	preload ()
	{ }
	
	create ()
	{
		console.log('BearPoke Quit Scene Created...');
		this.game.destroy(true);
	}
}

class Poker
{
	static 	newGame = function ()
	{
		console.log('New Game');
		
		const gameConfig = {
			render: {
				pixelArt: true,
			},
			scale: {
				mode: Phaser.Scale.ScaleModes.FIT,
				height: 768,
				width: 1024,
			},
			audio: {
				disableWebAudio: false,
			}
			
		};
		let game = new Phaser.Game(gameConfig);
		this.game = game;
		
		game.scene.add('Boot', BootScene);
		game.scene.add('Preloader', PreloadScene);
		game.scene.add('MainMenu', MainMenu);
//		game.scene.add('MainGame', MainGame);
//		game.scene.add('GameOver', GameOver);
//		game.scene.add('Credits', Credits);
		game.scene.add('Quit', QuitScreen);
//		
		game.scene.start('Boot');
		return game;
	}
	
	static quit = function ()
	{
		let game = this.game;
		game.destroy(true);
	}
	
}

Poker.newGame();

console.log('Main Script Loaded');