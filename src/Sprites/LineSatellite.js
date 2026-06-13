class LineSatellite extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        super(scene, x, y, img, frame, type, speed);

        this.attackCooldown = Math.random() * (4) + 3;

        return this;
    }

    update(t, delta) {
        let dt = delta / 1000

        if (this.type == 3) {
            this.attackCooldown -= dt; 
        }
    }

}