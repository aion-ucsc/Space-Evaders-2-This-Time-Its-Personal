class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, img, frame, isEnemy, speed, initAngle) {
        super(scene, x, y, img, frame);

        this.x = x;
        this.y = y;
        this.direction = 1;

        if (isEnemy == null || isEnemy == false) {
            this.changeStatus(false);
        } else {
            this.direction = -1;
            this.changeStatus(true);
            scene.add.existing(this);
        }

        this.gameWidth = scene.game.config.width;
        this.gameHeight = scene.game.config.height;
        this.physics = scene.physics;


        if (speed != null) {
            this.speed = speed;
        }

        scene.children.bringToTop(this);
        scene.physics.add.existing(this);

        if (initAngle != null) {
            this.setVel(initAngle + 90);
            this.angle = initAngle;
        }

        return this;
    }

    update(t, delta) {
        let dt = delta / 1000;
        if (this.active) {
            if (this.x < 0 - this.displayWidth || this.x > this.gameWidth + this.displayWidth || 
                this.y < 0 - this.displayHeight || this.y > this.gameHeight + this.displayHeight) {
                this.changeStatus(false);
            }
        }
    }

    setVel(angle) {
        let velocity = this.physics.velocityFromAngle(angle, this.speed);
        this.setVelocity(velocity.x, velocity.y);
    }


    changeStatus(status) {
        this.visible = status;
        this.active = status;
    }
}