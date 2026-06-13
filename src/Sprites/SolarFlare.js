class SolarFlare extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        //sends info to Enemy superclass
        super(scene, x, y, img, frame, type, speed);
 
        return this;
    }

    followPath(nodes) {
        //creates a tween for the flare to move from the top of the screen to the bottom

        this.scene.tweens.add({
            targets: this,
            y: 650,
            duration: 30000,
            ease: "Sine.easeInOut",
            onComplete: () => {
                if (this.scene != null) {
                    this.scene.lives -= 1;
                    this.scene.updateLives();
                    this.scene.remainingEnemies -= 1;
                    this.destroy();
                }
            }
        });
    }

}