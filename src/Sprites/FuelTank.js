class FuelTank extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        //sends info to Enemy superclass
        super(scene, x, y, img, frame, type, speed);
 
        return this;
    }

    onDestroy(enemies) {

        //runs on enemy destroy (for fueltank specifically)

        //function setup - init index array, finds the index of current enemy, removes the enemy reference in enemies
        let indexArr = [];
        let index = enemies.indexOf(this);
        enemies[index] = null;

        //checks which elements in enemies collide with the explosion radius of the fuel tank

        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] != null && this.checkCollision(this, enemies[i])) {
                indexArr.push(i);
            }
        }

        //registers the collision for each enemy colliding with the fuel tank

        for (let i = 0; i < indexArr.length; i++) {
            let sprite = enemies[indexArr[i]];
            if (sprite != null) {
                this.scene.register_collision(sprite);
            }
        }

        //destroys the fueltank

        this.destroy();
    }

    checkCollision(a, b) {

        //checks collision of explosion with enemy sprites

        //radius of explosion from center of fueltank
        let explosion_offset = 100; 

        //calculates distances from center of fueltank to center of enemy
        let xDiff = Math.abs((a.x + a.displayWidth/2) - (b.x + b.displayWidth/2));
        let yDiff = Math.abs((a.y + a.displayHeight/2) - (b.y + b.displayHeight/2));

        //finds the absolute distance between said two objeects
        let dist = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

        if (explosion_offset > dist) {
            //returns true if in distance
            return true;
        }
        return false;
    }

    followPath(nodes) {

        //follows paths depending on random value assignment of x and y
        //sets rotation depending on which side of the screen fueltank is coming from
        //creates a tween to move it to opposite end of the screen, removing itself when done

        if (nodes[0].x == 0) {
            this.rotation = Math.PI/2;

            this.scene.tweens.add({
                targets: this,
                x: 850,
                duration: 4000,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    if (this.scene != null) {
                        this.scene.remainingEnemies -= 1;
                        this.destroy();
                    }
                }
            });
        } else if (nodes[0].x == 800) {
            this.rotation = -Math.PI/2;
            this.scene.tweens.add({
                targets: this,
                x: -50,
                duration: 4000,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    if (this.scene != null) {
                        this.scene.remainingEnemies -= 1;
                        this.destroy();
                    }
                }
            });
        } else if (nodes[0].y == 0) {
            this.rotation = -Math.PI;
            this.scene.tweens.add({
                targets: this,
                y: 650,
                duration: 3000,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    if (this.scene != null) {
                        this.scene.remainingEnemies -= 1;
                        this.destroy();
                    }
                }
            });
        } else if (nodes[0].y == 600) {
            this.rotation = 0;
            this.scene.tweens.add({
                targets: this,
                y: -50,
                duration: 3000,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    if (this.scene != null) {
                        this.scene.remainingEnemies -= 1;
                        this.destroy();
                    }
                }
            });
        }

    }
 
}