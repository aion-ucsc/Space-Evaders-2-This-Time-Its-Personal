class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, img, frame, isEnemy, speed, initAngle) {
        //sends info up to superclass
        super(scene, x, y, img, frame);

        //basic variable setup
        this.x = x;
        this.y = y;
        this.direction = 1;

        //determines direction of bullet depending on if enemy or not, also adds it to existing if enemy bullet
        if (isEnemy == null || isEnemy == false) {
            this.changeStatus(false);
        } else {
            this.direction = -1;
            this.changeStatus(true);
            scene.add.existing(this);
        }

        //sets some game variables
        this.gameWidth = scene.game.config.width;
        this.gameHeight = scene.game.config.height;
        this.physics = scene.physics;

        //sets speed if not null
        if (speed != null) {
            this.speed = speed;
        }

        //sets bullet to top of screen and adds it to physics
        scene.children.bringToTop(this);
        scene.physics.add.existing(this);

        //sets the initial velocity if initangle is not null
        if (initAngle != null) {
            this.setVel(initAngle + 90);
            this.angle = initAngle;
        }

        return this;
    }

    update(t, delta) {
        let dt = delta / 1000;

        //if bullet is offscreen, changes its status to false

        if (this.active) {
            if (this.x < 0 - this.displayWidth || this.x > this.gameWidth + this.displayWidth || 
                this.y < 0 - this.displayHeight || this.y > this.gameHeight + this.displayHeight) {
                this.changeStatus(false);
            }
        }
    }

    //sets velocity of bullet based on angle and speed
    setVel(angle) {
        let velocity = this.physics.velocityFromAngle(angle, this.speed);
        this.setVelocity(velocity.x, velocity.y);
    }


    changeStatus(status) {
        this.visible = status;
        this.active = status;
    }
}