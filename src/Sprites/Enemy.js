class Enemy extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, img, frame, type, speed) {
        //sends info to superclass
        super(scene, x, y, img, frame);

        //sets enemy variables
        this.type = type;
        this.speed = speed;
        this.scene = scene;

        //adds enemy to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
 
        return this;
    }

    update(t, delta) {
        //basic update function
        let dt = delta / 1000
    }

    changeStatus(status) {
        //status change function
        this.visible = status;
        this.active = status;
    }

    followPath(nodes) {
        //skeleton function for following path
    }

    onDestroy(enemies) {
        //skeleton function for destroyed object
    }
}