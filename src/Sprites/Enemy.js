class Enemy extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, img, frame, type, speed) {
        super(scene, x, y, img, frame);

        this.type = type;
        this.speed = speed;
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
 
        return this;
    }

    update(t, delta) {
        let dt = delta / 1000
    }

    changeStatus(status) {
        this.visible = status;
        this.active = status;
    }

    onDestroy(enemies) {

    }
}