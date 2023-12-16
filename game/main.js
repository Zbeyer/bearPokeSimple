class BootScene extends Phaser.Scene
{
		create () { 
			this.game.scene.start('Preloader');
		}
}

class PreloadScene extends Phaser.Scene
{
		preload () {
			// this.load.baseURL = 'https://zbeyer.meteorapp.com/assets/';
			// Access to XMLHttpRequest at 'https://zbeyer.meteorapp.com/assets/sloth.png' from origin 'null'
			// has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
			// is present on the requested resource.

			this.load.baseURL = './game/images/';
			this.load.image('bg5', 'bg5.jpg');

			this.load.image('pokeDust', 'poke-dust.jpg');

			//animals
			this.load.image('bear', 'bear.png');
			this.load.image('deer', 'deer.png');
			this.load.image('duck', 'duck.png');
			this.load.image('fish', 'fish.png');
			this.load.image('moose', 'moose.png');
			this.load.image('sloth', 'sloth.png');
			this.load.image('snek', 'snek.png');

			//hearts
			this.load.image('heartEmpty', 'heart-empty.png');
			this.load.image('heartBlack', 'heart-black.png');
			this.load.image('heartFull', 'heart-full.png');

			//buttons
			this.load.image('button', 'button-up.jpg');
			this.load.image('buttonDown', 'button-down.jpg');
		}
	
		create () {

			this.scene.start('MainMenu');
			this.scene.stop('Preloader');
		}
}

class QuitScreen extends Phaser.Scene
{
	create ()
	{
		this.game.destroy(true);
	}
}

class Poker
{
	static 	newGame = function ()
	{
		const gameConfig = {
			render: {
				pixelArt: true,
			},
			scale: {
				mode: Phaser.Scale.ScaleModes.FIT,
				height: 1024,
				width: 640,
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
		game.scene.add('MainGame', MainGame);
		game.scene.add('GameOver', GameOver);
		game.scene.add('Credits', Credit);
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