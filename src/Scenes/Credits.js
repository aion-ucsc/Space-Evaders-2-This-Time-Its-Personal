class Credits extends Phaser.Scene {
    constructor() {
        //basic setup
        super("credits");

        this.obj = {sprite: {}, text: {}, fx: {}};
    }

    create() {
        let obj = this.obj

        this.space = this.input.keyboard.addKey("SPACE");

        //initializes sprite
        obj.sprite.bg = this.add.sprite(game.config.width/2, game.config.height/2, "bg");
        obj.sprite.bg.setScale(4);

        //initializes text
        obj.text.title = this.add.bitmapText(175,0, "CossetteTexte", "TRY AGAIN?");
        obj.text.title.setFontSize(100);
        obj.text.subtitle = this.add.bitmapText(200,100, "CossetteTexte", "PRESS SPACE");
        obj.text.subtitle.setFontSize(75);
        obj.text.credit1 = this.add.bitmapText(130, 300, "CossetteTexte", "ASSETS FROM KENNY ASSET PACKS:");
        obj.text.credit1.setFontSize(40);
        obj.text.credit2 = this.add.bitmapText(60, 350, "CossetteTexte", "SPACE SHOOTER & SPACE SHOOTER EXTENSION");
        obj.text.credit2.setFontSize(40);
        obj.text.credit3 = this.add.bitmapText(250, 400, "CossetteTexte", "& KENNY PARTICLES");
        obj.text.credit3.setFontSize(40);
        obj.text.credit4 = this.add.bitmapText(10, 450, "CossetteTexte", "COSSETTE TEXT FROM GOOGLE FONTS, SOUNDS FROM SOUNDLY");
        obj.text.credit4.setFontSize(32);
        obj.text.credit5 = this.add.bitmapText(250, 550, "CossetteTexte", "GAME BY AIDAN ION");
        obj.text.credit5.setFontSize(40);

        //applies fx - technicolor filter + barrel
        obj.fx.cmfltr = this.cameras.main.filters.internal.addColorMatrix();
        obj.fx.colMat = obj.fx.cmfltr.colorMatrix;
        obj.fx.colMat.technicolor();

        obj.fx.barrel = this.cameras.main.filters.external.addBarrel(1.1);

    }

    update(t, delta) {
        //allows player to restart once pressing the space key
        if (this.space.isDown) {
            this.scene.resume("spaceEvaders");
            this.scene.stop();
        }
    }
}