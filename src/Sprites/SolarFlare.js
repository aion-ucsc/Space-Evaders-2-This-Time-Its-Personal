class SolarFlare extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        super(scene, x, y, img, frame, type, speed);
 
        return this;
    }

    update(t, delta) {
        let dt = delta / 1000

        if (this.type == 1) {
            this.y += this.speed * dt / 4;
            if (this.y > (this.scene.game.config.height + this.displayHeight)) {
                this.changeStatus(false);
                this.scene.lives -= 1;
                this.scene.updateLives();
                this.scene.remainingEnemies -= 1;
            }
        }
    }

}