import 'phaser'
import BearPoke from "../classes/bear";
import BG from "../classes/background";

export default class GameOver extends Phaser.Scene
{
	preload ()
	{ }

	create ()
	{
		const menuWidth = this.cameras.main.width * 0.50;
		const menuHeight = this.cameras.main.height;
		const menuX: number = this.cameras.main.width - menuWidth;
		const menuY: number = 0;

		let bg: Phaser.GameObjects.Image = new BG(this).backgroundImage;

		let scoreBG: Phaser.GameObjects.Rectangle = this.add.rectangle(0, 0, this.cameras.main.width - menuWidth, this.cameras.main.height, 0x000000);
		scoreBG.setOrigin(0, 0);
		scoreBG.setBlendMode(Phaser.BlendModes.MULTIPLY);
		scoreBG.setAlpha(0.667);

		let text = this.add.text(16, 16, 'title', { color: '#FFFFFF' });
		text.setBlendMode(Phaser.BlendModes.ADD);
		text.scale = 3.0;
		text.setText([
			'Game',
			'Over',
		]);


		let scoreText = this.add.text(16, text.y * 2 + text.height * 2 + 64, 'score', { color: '#FFFFFF' });
		scoreText.setBlendMode(Phaser.BlendModes.ADD);
		scoreText.scale = 2.0;
		let timeStopped = BearPoke.shared().stoppedTime;
		let timeStarted = BearPoke.shared().startTime;
		let delta = (timeStopped - timeStarted) / 1_000;
		let time = delta.toFixed(1);

		scoreText.setText([
			'Score: ' + BearPoke.shared().score,
			'', // empty line
			'Pokes: ' + BearPoke.shared().pokes,
			'Healz: ' + BearPoke.shared().healingAnimals,
			'time:\n' +  time,
			'', // empty line
			'Bear Pokes:\n' + BearPoke.shared().bearPokes,

		]);
		const rectangle = this.add.rectangle(menuX, menuY, menuWidth, menuHeight, 0x000000);
		rectangle.setOrigin(0, 0);
		rectangle.setBlendMode(Phaser.BlendModes.MULTIPLY);
		rectangle.setAlpha(0.50);
		const heartsBg: Phaser.GameObjects.Rectangle = this.add.rectangle(0, this.cameras.main.height - 16,
			BearPoke.shared().maxHearts * 80, 48,
			0x000000);
		heartsBg.alpha = 0.50;
		for (let i = 0; i < BearPoke.shared().maxHearts; i++)
		{
			this.add.image(16 + i * 32, this.cameras.main.height - 16, 'heartEmpty').setScale(3.0);
		}

		this.createButtons(menuX, menuY, menuWidth);
	}

	createButtons(menuX: number, menuY: number, menuWidth: number)
	{
		const game: Phaser.Game = this.game;
		const scene = game.scene;
		let x: number;
		let y: number;

		const buttonOffsetX = 8;
		const buttonOffsetY = 8;
		const buttonWidth: number = menuWidth - buttonOffsetX * 2.0;
		const buttonScale: number = buttonWidth / 40; // the button image is 40px wide
		const buttonHeight: number = 76.0;
		const buttons: Phaser.GameObjects.Image[] = [
			this.add.image(menuX + buttonOffsetX, menuY + buttonOffsetY, 'button'),
			this.add.image(menuX + buttonOffsetX, menuY + buttonHeight + buttonOffsetY * 2.0, 'button'),
			this.add.image(menuX + buttonOffsetX, menuY + buttonHeight * 2.0 + buttonOffsetY * 3.0, 'button'),
		];

		buttons.forEach( function (button) {
			button.setOrigin(0, 0);
			button.setScale(buttonScale);
			button.setInteractive();
		});

		x = buttons[0].x + buttonOffsetX;
		y = buttons[0].y + buttonOffsetY;
		const newGameText = this.add.text(x, y, 'New Game', { color: '#000000' })
		newGameText.scale = 2.25;
		buttons[0].on('pointerup', function (){
			scene.start('MainGame');
			scene.stop('GameOver');
		}, this);

		x = buttons[1].x + buttonOffsetX;
		y = buttons[1].y + buttonOffsetY;
		const attributionText = this.add.text(x, y, 'Main Menu', { color: '#000000' })
		attributionText.scale = 2.25;
		buttons[1].on('pointerup', function (){
			scene.start('MainMenu');
			/**
			 * Give attribution to the following:
			 * 		Phaser.io
			 * 		Pixabay.com
			 * 		Draw.io
			 */
			scene.stop('GameOver');
		}, this);

		x = buttons[2].x + buttonOffsetX;
		y = buttons[2].y + buttonOffsetY;
		const quitText = this.add.text(x, y, 'Quit', { color: '#000000' })
		quitText.scale = 2.25;
		buttons[2].on('pointerup', function (){
			scene.start('Quit');
			scene.stop('GameOver');
		}, this);
	}
}