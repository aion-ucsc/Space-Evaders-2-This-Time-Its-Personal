class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, img, frame, lKey, rKey, upKey, downKey, speed, arrowkeys) {
        //sends info up to superclass
        super(scene, x, y, img, frame);

        //sets up keys and speed
        this.left = lKey;
        this.right = rKey;
        this.up = upKey;
        this.down = downKey;
        this.speed = speed;
        this.leftR = arrowkeys.left;
        this.rightR = arrowkeys.right;
        this.upR = arrowkeys.up;
        this.downR = arrowkeys.down;

        //enables player in the scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        return this;
    }

    update(t, delta) {
        let dt = delta / 1000;

        //movement variables - moves the player based on WASD controls

        if (this.left.isDown) {
            if (this.x > (this.displayWidth)) {
                this.x -= this.speed * dt;
            }
        }

        if (this.right.isDown) {
            if (this.x < (game.config.width - (this.displayWidth))) {
                this.x += this.speed * dt;
            }
        }

        if (this.up.isDown) {
            if (this.y > (this.displayHeight)) {
                this.y -= this.speed * dt;
            }
        }

        if (this.down.isDown) {
            if (this.y < (game.config.height - (this.displayHeight))) {
                this.y += this.speed * dt;
            }
        }


        //Rotates the player based on arrow keys using linear interpolation
        if (this.upR.isDown) {
            if (this.leftR.isDown) {
                this.rotation = Phaser.Math.Linear(this.rotation, 3 * Math.PI/4, dt * 5);
            } else if (this.rightR.isDown) {
                this.rotation = Phaser.Math.Linear(this.rotation, -3 * Math.PI/4, dt * 5);
            } else {
                this.rotation = Phaser.Math.Linear(this.rotation, Math.PI, dt * 5);
            }
        } else if (this.downR.isDown) {
            if (this.leftR.isDown) {
                this.rotation = Phaser.Math.Linear(this.rotation, 1 * Math.PI/4, dt * 5);
            } else if (this.rightR.isDown) {
                this.rotation = Phaser.Math.Linear(this.rotation, -1 * Math.PI/4, dt * 5);
            } else {
                this.rotation = Phaser.Math.Linear(this.rotation, 0, dt * 5);
            }
        } else if (this.leftR.isDown) {
            this.rotation = Phaser.Math.Linear(this.rotation, 2 * Math.PI/4, dt * 5);
        } else if (this.rightR.isDown) {
            this.rotation = Phaser.Math.Linear(this.rotation, -2 * Math.PI/4, dt * 5);
        }

    }

}