class Credit extends Phaser.Scene
{
	preload ()
	{ }

	create ()
	{
		let scene = this;

		let text = scene.add.text(16, 16, 'credits', { color: '#FFFFFF' });
		text.setBlendMode(Phaser.BlendModes.ADD);
		text.scale = 2.0;
		text.setText([
			'Phaser.io for game engine',
			'Pixabay.com for background art',
			'Draw.io for animal art',
		]);
		const buttons = [
			scene.add.image(0, scene.cameras.main.height - 64, 'button'),
		];

		buttons.forEach( function (button) {
			button.setOrigin(0, 0);
			button.scale = scene.cameras.main.width / button.width
			button.setInteractive();
		});

		const buttonText = this.add.text(16, 16 + buttons[0].y, '< Back To Main Menu', { color: '#000000' })
		buttonText.scale = 2.25;
		buttons[0].on('pointerup', function (){
			scene.game.scene.start('MainMenu');
			scene.game.scene.stop('Credits');
		}, this);

	}
}