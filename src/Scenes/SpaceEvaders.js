class SpaceEvaders extends Phaser.Scene {
    constructor() {
        //sends name to superclass
        super("spaceEvaders")

        //initializes obj (the goat)
        this.obj = {sprite: {}, text: {}, vfx: {}, sfx: {}, fx: {}};

        //initiates basic variables
        this.playerSpeed = 250;
        this.bulletSpeed = 400;

        this.bulletCD = 0.5;
        this.bulletCDCounter = 0;

        this.highScore = 0;

        //Gets stored highscore and initializes it if does not exist
        let storedHS = localStorage.getItem('highScore');
        if (storedHS) {
            this.highScore = storedHS;
        } else {
            localStorage.setItem('highScore', 0);
        }

        //more basic variables...
        this.score = 0;
        this.lives = 3;
        this.stagesclear = 0;

        this.restarting = true;
        this.restartTimeOut = 1.5;

        this.direction = 1;
        this.movementIncrement = 25;
    }

    create() {
        let obj = this.obj;

        //key creation
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey("SPACE");
        this.cursors = this.input.keyboard.createCursorKeys();

        //creates background sprite
        obj.sprite.bg = this.add.sprite(game.config.width/2, game.config.height/2, "bg");
        obj.sprite.bg.setScale(4);

        //sets text values/visibility
        obj.text.health = this.add.bitmapText(0,510, "CossetteTexte", "LIVES: 3");
        obj.text.score = this.add.bitmapText(0,540, "CossetteTexte", "SCORE: 0");
        obj.text.highScore = this.add.bitmapText(0, 0, "CossetteTexte", "HIGH SCORE: " + this.highScore)
        obj.text.stagesclear = this.add.bitmapText(0,570, "CossetteTexte", "STAGES CLEAR: 0");
        obj.text.endText = this.add.bitmapText(325,250, "CossetteTexte", "STAGE CLEAR");
        obj.text.endText.visible = false;

        //sets up sound effects
        obj.sfx.explosion = this.sound.add("explosion_sound", {volume: 0.75, loop: false});
        obj.sfx.laser = this.sound.add("laser_sound", {volume: 0.5, loop: false});
        obj.sfx.winSound = this.sound.add("win_sound", {volume: 0.75, loop: false});
        obj.sfx.loseSound = this.sound.add("lose_sound", {volume: 0.75, loop: false});

        //sets up filters - technicolor filter and barrel
        obj.fx.cmfltr = this.cameras.main.filters.internal.addColorMatrix();
        obj.fx.colMat = obj.fx.cmfltr.colorMatrix;
        obj.fx.colMat.technicolor()

        obj.fx.barrel = this.cameras.main.filters.external.addBarrel(1.1);
    }

    init_game() {
        let obj = this.obj;

        //resets remaining enemies and existing enemies in obj arrays
        this.remainingEnemies = 0;

        this.obj.sprite.enemies = [];
        this.obj.sprite.enemyBullets = [];

        //creates the player

        obj.sprite.pSatellite = new Player(this, this.game.config.width/2, game.config.height/2, "pSatellite", null, 
            this.left, this.right, this.up, this.down, this.playerSpeed,
            this.cursors
        );
        obj.sprite.pSatellite.setScale(0.5);
        obj.sprite.pSatellite.rotation = Math.PI;
        obj.sprite.pSatellite.enableFilters();

        //creates player's bulletgroup
        obj.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "pBullet",
            maxSize: 3, 
            runChildUpdate: true,
            setScale: 0.5
        });
        
        obj.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: obj.sprite.bulletGroup.defaultKey,
            repeat: obj.sprite.bulletGroup.maxSize - 1,
        });
        obj.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

        //Enemy creation loop
        for (let i = 0; i < 40; i++) {
            //basic variable setup for enemy determination
            let enemyType = null;
            let enemySprite = null;
            let rand = Math.ceil(Math.random() * 100);

            if (rand < 40) { 
                //40% chance to spawn meteor
                enemyType = 2;
                enemySprite = "meteor";

                //makes sure they dont spawn on top of the player
                let gambling_machine_9000 = () => {
                    let x2 = Math.random() * 800;
                    let y2 = Math.random() * 600;
                    
                    if ((x2 < 350 || x2 > 450) && (y2 < 250 || y2 > 350)) {
                        return new Pointtt(x2, y2);
                    } else {
                        return gambling_machine_9000();
                    }
                }

                //gambling machine 9000
                let point2 = gambling_machine_9000();

                //creates new meteor enemy using specified/generated values
                obj.sprite.enemies[i] = new Meteor(this, point2.x, point2.y, enemySprite, null, enemyType, 100);
            } else if (rand < 70) {
                //30% chance to spawn an enemy satellite
                enemyType = 3;
                enemySprite = "eSatellite";

                //code to set x and y values of enemy satellite using randomization for what side it spawns on
                let rand3 = Math.ceil(Math.random() * 4);

                let x3 = 0;
                let y3 = 0;
                
                if (rand3 == 1) {
                    x3 = 0;
                    y3 = Math.random() * 600;
                } else if (rand3 == 2) {
                    x3 = 800;
                    y3 = Math.random() * 600;
                } else if (rand3 == 3) {
                    x3 = Math.random() * 800;
                    y3 = 0;
                } else if (rand3 == 4) {
                    x3 = Math.random() * 800;
                    y3 = 600;
                }

                //creates enemy satellite using specified/generated values
                obj.sprite.enemies[i] = new LineSatellite(this, x3, y3, enemySprite, null, enemyType, 100);
                //tells it to follow the path (one point)
                obj.sprite.enemies[i].followPath([new Pointtt(x3, y3)]);

            } else if (rand < 90) {
                //20% chance to spawn a solar flare
                enemyType = 1;
                enemySprite = "sFlare";

                //sets up basic coordinates
                let x1 = Math.random() * 800;
                let y1 = 0;

                //creates solar flare using specified/generated values
                obj.sprite.enemies[i] = new SolarFlare(this, x1, y1, enemySprite, null, enemyType, 100);
                //tells it to follow its determined path (one point)
                obj.sprite.enemies[i].followPath([new Pointtt(x1, y1)]);
            } else if (rand <= 100) {
                //10% chance to spawn a fueltank
                enemyType = 4;
                enemySprite = "fuelTank"

                //code to set x and y values of fueltank using randomization for what side it spawns on
                let rand4 = Math.ceil(Math.random() * 4);

                let x4 = 0;
                let y4 = 0;

                if (rand4 == 1) {
                    x4 = 0;
                    y4 = Math.random() * 600;
                } else if (rand4 == 2) {
                    x4 = 800;
                    y4 = Math.random() * 600;
                } else if (rand4 == 3) {
                    x4 = Math.random() * 800;
                    y4 = 0;
                } else if (rand4 == 4) {
                    x4 = Math.random() * 800;
                    y4 = 600;
                }

                //creates fueltank using specified/generated values
                obj.sprite.enemies[i] = new FuelTank(this, x4, y4, enemySprite, null, enemyType, 100);
                //tells it to follow its determined path (one point)
                obj.sprite.enemies[i].followPath([new Pointtt(x4, y4)]);
            }
            
            //registers increase in enemies
            this.remainingEnemies += 1;
                
            //sets scale of enemy sprites
            if (enemyType == 1) {
                obj.sprite.enemies[i].setScale(1.5);
            } else if (enemyType == 4) {
                obj.sprite.enemies[i].setScale(0.15);
            } else {
                obj.sprite.enemies[i].setScale(0.5);
            }
        }

        //creates vfx for destroyed enemies/player
        obj.vfx.destroyedVFX = this.add.particles(0, 0, "kenny-particles", {
                frame: ["star_06.png","star_07.png"],
                color: [0x3268a8, 0x241691, 0x8a10b3],
                colorEase: "quad.out",
                x: {min: -5, max: 5},
                y: {min: -5, max: 5},
                speedX: {min: -100, max: 100},
                speedY: {min: -100, max: 100},
                gravityX: 0,
                gravityY: 0,
                scale: {start: 0.05, end: 0.01},
                alpha: {start: 0.2, end: 1},
                duration: 50,
                lifespan: 500,
                frequency: 10,
                quantity: 3,
                blendMode: "ADD"
        });

        obj.vfx.destroyedVFX.stop();

        //Adds physics collision for enemy <-> psatellite
        this.physics.add.overlap(obj.sprite.pSatellite, obj.sprite.enemies, (obj1, obj2) => {
            //removes a life
            this.lives -= 1;
            this.updateLives();

            //registers the collision (for score and particles and such)
            this.register_collision(obj2);
        });

        this.physics.add.overlap(obj.sprite.bulletGroup, obj.sprite.enemies, (obj1, obj2) => {
            if (obj1.active == true) {

                //disables the bullet
                obj1.changeStatus(false);
                
                //registers the collision (for score and particles and such)
                this.register_collision(obj2);
            }
        });

        //stops the restarting process
        this.restarting = false;


    }

    //destroys game objects, preps for restart
    destroy_game() {
        let obj = this.obj;

        //destroys all enemies
        for (let sprite of obj.sprite.enemies) {
            if (sprite != null) {
                sprite.destroy();
                sprite = null;
            }
        }

        //destroys all enemy bullets
        for (let sprite of obj.sprite.enemyBullets) {
            if (sprite != null) {
                sprite.destroy();
                sprite = null;
            }
        }

        //destroys player satellite
        obj.sprite.pSatellite.destroy();

        //destroys player bullets
        for (let sprite of obj.sprite.bulletGroup.getChildren()) {
            sprite.destroy();
        }

        obj.sprite.bulletGroup.clear(true);
    }

    update(t, delta) {

        let obj = this.obj;
        let dt = delta/1000

        if (this.restarting) {
            //if game is being restarted
            //checks restart time out
            if (this.restartTimeOut < 2) {
                this.restartTimeOut += dt;
            } else {
                //if player lost all their lives send them to credits
                if (this.lives <= 0) {
                    this.scene.pause();
                    this.scene.launch("credits");

                    this.lives = 3;
                    this.updateLives(); 
                }
                
                //restarts the game
                obj.text.endText.visible = false;
                this.init_game();
                this.restartTimeOut = 0;
            }
            return;
        } else if (this.lives <= 0) {
            //if player has lost all their lives
            //starts restarting process and destroys the game
            this.restarting = true;
            this.destroy_game();

            //resets some values + plays lose sound
            this.score = 0;
            this.stagesclear = 0;
            obj.sfx.loseSound.play();
            
            //resets score and texts, enables game over text
            obj.text.stagesclear.setText("STAGES CLEAR: " + this.stagesclear);
            this.updateScore();
            obj.text.endText.setText("GAME OVER!");
            obj.text.endText.visible = true;
            
            return;
        } else if (this.remainingEnemies == 0) {
            //if all enemies are defeated
            //restarts and destroys game
            this.restarting = true;
            this.destroy_game();

            //increases lives and stagesclear, plays win sound
            this.stagesclear += 1;
            this.lives += 1;
            this.updateLives();
            obj.sfx.winSound.play();

            //sets texts
            obj.text.stagesclear.setText("STAGES CLEAR: " + this.stagesclear);
            obj.text.endText.setText("STAGE CLEAR!");
            obj.text.endText.visible = true;
            
            return;
        }

        //reduces bullet cooldown counter
        this.bulletCDCounter -= dt;

        //checks if player is trying to fire
        if (this.space.isDown) {
            //checks if bullet is off cooldown
            if (this.bulletCDCounter < 0) {
                //sets up bullet if not null
                let bullet = obj.sprite.bulletGroup.getFirstDead();
                if (bullet != null) {
                    this.bulletCDCounter = this.bulletCD;
                    bullet.changeStatus(true);
                    bullet.x = obj.sprite.pSatellite.x;
                    bullet.y = obj.sprite.pSatellite.y - (obj.sprite.pSatellite.displayHeight/2);
                    //sets velocity and angle of the bullet
                    bullet.setVel(obj.sprite.pSatellite.angle + 90);
                    bullet.angle = obj.sprite.pSatellite.angle;
                    //plays laser noise
                    obj.sfx.laser.play();
                }
            }
        }

        //updates pSatellite
        obj.sprite.pSatellite.update(t, delta);
    
        //loops through enemy sprites, checking for enemy satellites
        for (let sprite of obj.sprite.enemies) {
            if (sprite != null) {
                //updates the sprite
                sprite.update(t, delta);

                //gets sprite index
                let index = obj.sprite.enemies.indexOf(sprite);

                //checks if bullet cd is down and if type is correct
                if (sprite.type == 3 && sprite.attackCooldown <= 0) {
                    //creates new enemy bullet
                    let eBullet = new Bullet(this, sprite.x, sprite.y + sprite.displayHeight/2, "eBullet", null, true, 200, sprite.angle + 180)
                    obj.sprite.enemyBullets.push(eBullet);

                    //creates enemy physics overlap
                    this.physics.add.overlap(obj.sprite.pSatellite, eBullet, (obj1, obj2) => {
                        //sets vfx + destroys enemy bullet
                        let index = obj.sprite.enemyBullets.indexOf(obj2)
                        obj.vfx.destroyedVFX.emitParticleAt(obj2.x, obj2.y, 50);
                        obj2.destroy();
                        obj.sprite.enemyBullets[index].y = 1000;

                        //removes life + plays explosion sound
                        this.lives -= 1;
                        obj.sfx.explosion.play()
                        this.updateLives();
                    });

                    //resets attack cooldown
                    sprite.attackCooldown = Math.random() * (4) + 3;
                }

            }
        }
        
        //filters enemy bullets based on where they are on the screen (deletes them if off)
        obj.sprite.enemyBullets = obj.sprite.enemyBullets.filter((bullet) => bullet.y < (this.game.config.height + bullet.displayHeight/2));
        obj.sprite.enemyBullets = obj.sprite.enemyBullets.filter((bullet) => bullet.x < (this.game.config.width + bullet.displayWidth/2));
        obj.sprite.enemyBullets = obj.sprite.enemyBullets.filter((bullet) => bullet.y > (0 - bullet.displayHeight/2));
        obj.sprite.enemyBullets = obj.sprite.enemyBullets.filter((bullet) => bullet.x > (0 - bullet.displayWidth/2));

        //updates enemy bullets if they're not null
        for (let bullet of obj.sprite.enemyBullets) {
            if (bullet != null) {
                bullet.update(t, delta);
                if (bullet.y >= this.game.config.height + bullet.displayHeight/2) {
                    
                    bullet.changeStatus(false);
                }
            }
        }

    }

    register_collision(sprite) {

        //registers collision

        //sets up shorthands/basic variables
        let obj = this.obj
        let spriteType = sprite.type;
        let enemies = obj.sprite.enemies;
        let index = enemies.indexOf(sprite);

        //plays vfx at destroyed object
        obj.vfx.destroyedVFX.emitParticleAt(sprite.x, sprite.y, 50);

        //adds score based on enemy type defeated
        if (spriteType == 1) {
            this.score += 150;
        } else if (spriteType == 2) {
            this.score += 100;
        } else if (spriteType == 3) {
            this.score += 250;
        } else if (spriteType == 4) {
            this.score += 400;
            //destroys nearby enemies basically
            sprite.onDestroy(enemies);
        }

        //updates score
        this.updateScore();
        // if enemy wasnt already deleted by .onDestroy
        if (enemies[index] != null) {
            sprite.destroy();
            enemies[index] = null;
        }
        //plays explosion sfx
        obj.sfx.explosion.play();
        this.remainingEnemies -= 1;
    }

    //collision checker
    collides(a, b) {
        if (Math.abs(a.x-b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y-b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
 
    //updates score text and high score
    updateScore() {
        let obj = this.obj;
        obj.text.score.setText("SCORE: " + this.score);
        //if score is more than highscore
        if (this.score > this.highScore) {
            //sets new highscore and highscore text, sets it in local storage
            this.highScore = this.score;
            obj.text.highScore.setText("HIGH SCORE: " + this.highScore);
            localStorage.setItem('highScore', this.highScore);
        }
    }

    //updates lives text
    updateLives() {
        let obj = this.obj
        obj.text.health.setText("LIVES: " + this.lives)
    }

}