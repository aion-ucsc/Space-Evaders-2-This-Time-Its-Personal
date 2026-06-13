class LineSatellite extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        //sends info to Enemy superclass
        super(scene, x, y, img, frame, type, speed);

        //sets attackcooldown
        this.attackCooldown = Math.random() * (4) + 3;

        return this;
    }

    update(t, delta) {
        let dt = delta / 1000
        
        //lowers attack cooldown
        if (this.type == 3) {
            this.attackCooldown -= dt; 
        }
    }

    followPath(nodes) {

        //follows paths depending on random value assignment of x and y
        //sets rotation depending on which side of the screen satellite is coming from
        //creates a tween to move it to opposite end of the screen, randomizing the other coordinate value, removing itself when done

        if (nodes[0].x == 0) {
            this.rotation = Math.PI/2;

            this.scene.tweens.add({
                targets: this,
                x: 850,
                y: Math.random() * 600,
                duration: 25000,
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
                y: Math.random() * 600,
                duration: 25000,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    if (this.scene != null) {
                        this.scene.remainingEnemies -= 1;
                        this.destroy();
                    }
                }
            });
        } else if (nodes[0].y == 0) {
            this.rotation = Math.PI;
            this.scene.tweens.add({
                targets: this,
                y: 650,
                x: Math.random() * 800,
                duration: 25000,
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
                x: Math.random() * 800,
                duration: 25000,
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