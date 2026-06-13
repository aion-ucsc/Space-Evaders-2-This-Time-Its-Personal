class FuelTank extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        super(scene, x, y, img, frame, type, speed);
 
        return this;
    }

    onDestroy(enemies) {
        let indexArr = [];
        let index = enemies.indexOf(this);
        enemies[index] = null;

        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] != null && this.checkCollision(this, enemies[i])) {
                console.log(i, ":I");
                indexArr.push(i);
            }
        }

        for (let i = 0; i < indexArr.length; i++) {
            let sprite = enemies[indexArr[i]];
            console.log(enemies[indexArr[i]], "," , indexArr[i], "," , i);
            if (sprite != null) {
                this.scene.register_collision(sprite);
            }
        }

        this.destroy();
    }

    checkCollision(a, b) {

        let explosion_offset = 100; 

        let xDiff = Math.abs((a.x + a.displayWidth/2) - (b.x + b.displayWidth/2));
        let yDiff = Math.abs((a.y + a.displayHeight/2) - (b.y + b.displayHeight/2));

        let dist = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

        if (explosion_offset > dist) {
            return true;
        }
        return false;
    }
 
}