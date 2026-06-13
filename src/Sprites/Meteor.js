class Meteor extends Enemy {
    
    constructor(scene, x, y, img, frame, type, speed) {
        //sends info to Enemy superclass
        super(scene, x, y, img, frame, type, speed);
 
        return this;
    }

    update(t, delta) {
        let dt = delta / 1000;

        //spins meteor
        this.rotation += delta * 0.0005;
        
    }

}