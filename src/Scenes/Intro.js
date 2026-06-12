class Intro extends Phaser.Scene {
    constructor() {
        //basic setup
        super("intro");

        this.obj = {sprite: {}, text: {}, fx: {}};
    }

    create() {
        let obj = this.obj

        this.space = this.input.keyboard.addKey("SPACE");

        //initializes sprites
        obj.sprite.bg = this.add.sprite(game.config.width/2, game.config.height/2, "bg");
        obj.sprite.bg.setScale(4);

        obj.sprite.satellite = this.add.sprite(383, 250, "pSatellite");
        obj.sprite.satellite.setScale(3);

        //initializes text
        obj.text.title = this.add.bitmapText(175,0, "CossetteTexte", "SPACE EVADERS 2:");
        obj.text.title.setFontSize(60);
        obj.text.subtitle = this.add.bitmapText(150,50, "CossetteTexte", "THIS TIME ITS PERSONAL");
        obj.text.subtitle.setFontSize(50);
        obj.text.control1 = this.add.bitmapText(260, 400, "CossetteTexte", "WASD TO MOVE,");
        obj.text.control1.setFontSize(40);
        obj.text.control2 = this.add.bitmapText(190, 450, "CossetteTexte", "ARROW KEYS TO ROTATE,");
        obj.text.control2.setFontSize(40);
        obj.text.control3 = this.add.bitmapText(220, 500, "CossetteTexte", "SPACE TO FIRE/START");
        obj.text.control3.setFontSize(40);

        //applies fx - technicolor filter + barrel
        obj.fx.cmfltr = this.cameras.main.filters.internal.addColorMatrix();
        obj.fx.colMat = obj.fx.cmfltr.colorMatrix;
        obj.fx.colMat.technicolor();

        obj.fx.barrel = this.cameras.main.filters.external.addBarrel(1.1);
    }

    update(t, delta) {
        //allows player to start playing once pressing the space key
        if (this.space.isDown) {
            this.scene.start("spaceEvaders");
            this.scene.stop();
        }
    }

}