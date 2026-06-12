class Load extends Phaser.Scene {
    constructor() {
        super("load");
    }

    preload() {
        this.load.setPath("./assets/Kenney_space-shooter-remastered");
        
        this.load.image("bg", "/Backgrounds/darkPurple.png");

        this.load.image("pSatellite", "/PNG/Enemies/enemyBlack1.png");
        this.load.image("pBullet", "/PNG/Lasers/laserBlue05.png");
        this.load.image("eBullet", "/PNG/Lasers/laserGreen05.png");

        this.load.image("sFlare", "/PNG/Lasers/laserRed05.png");
        this.load.image("meteor", "/PNG/Meteors/meteorBrown_big3.png");
       
        this.load.setPath("./assets/Kenney_space-shooter-extension/PNG");

        this.load.image("eSatellite", "/Sprites/Ships/spaceShips_004.png");
        this.load.image("fuelTank", "/Sprites/Rockets/spaceRockets_004.png");

        this.load.setPath("./assets");
        
        this.load.bitmapFont('CossetteTexte', "CossetteTexte-Bitmap_0.png", "CossetteTexte-Bitmap.fnt");

        this.load.audio("explosion_sound", "explosion.wav");
        this.load.audio("laser_sound", "laser.wav");
        this.load.audio("win_sound", "win.wav");
        this.load.audio("lose_sound", "lose.wav");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

    }

    create() {
        this.scene.start("spaceEvaders");
    }
}