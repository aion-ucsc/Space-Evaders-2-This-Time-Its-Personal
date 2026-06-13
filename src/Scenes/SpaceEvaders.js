class SpaceEvaders extends Phaser.Scene {
    constructor() {
        super("spaceEvaders")

        this.obj = {sprite: {}, text: {}, vfx: {}, sfx: {}, fx: {}};

        this.playerSpeed = 250;
        this.bulletSpeed = 400;

        this.bulletCD = 0.5;
        this.bulletCDCounter = 0;

        this.highScore = 0;

        let storedHS = localStorage.getItem('highScore');
        if (storedHS) {
            this.highScore = storedHS;
        } else {
            localStorage.setItem('highScore', 0);
        }

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

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey("SPACE");
        this.cursors = this.input.keyboard.createCursorKeys();

        obj.sprite.bg = this.add.sprite(game.config.width/2, game.config.height/2, "bg");
        obj.sprite.bg.setScale(4);

        this.points = [

        ]

        obj.text.health = this.add.bitmapText(0,510, "CossetteTexte", "LIVES: 3");
        obj.text.score = this.add.bitmapText(0,540, "CossetteTexte", "SCORE: 0");
        obj.text.highScore = this.add.bitmapText(0, 0, "CossetteTexte", "HIGH SCORE: " + this.highScore)
        obj.text.stagesclear = this.add.bitmapText(0,570, "CossetteTexte", "STAGES CLEAR: 0");
        obj.text.endText = this.add.bitmapText(325,250, "CossetteTexte", "STAGE CLEAR");
        obj.text.endText.visible = false;

        obj.sfx.explosion = this.sound.add("explosion_sound", {volume: 0.75, loop: false});
        obj.sfx.laser = this.sound.add("laser_sound", {volume: 0.5, loop: false});
        obj.sfx.winSound = this.sound.add("win_sound", {volume: 0.75, loop: false});
        obj.sfx.loseSound = this.sound.add("lose_sound", {volume: 0.75, loop: false});

        obj.fx.cmfltr = this.cameras.main.filters.internal.addColorMatrix();
        obj.fx.colMat = obj.fx.cmfltr.colorMatrix;
        obj.fx.colMat.technicolor()

        obj.fx.barrel = this.cameras.main.filters.external.addBarrel(1.1);
    }

    init_game() {
        let obj = this.obj;

        this.remainingEnemies = 0;

        this.obj.sprite.enemies = [];
        this.obj.sprite.enemyBullets = [];
        this.paths = [];
        this.curves = [];

        obj.sprite.pSatellite = new Player(this, this.game.config.width/2, game.config.height - 40, "pSatellite", null, 
            this.left, this.right, this.up, this.down, this.playerSpeed,
            this.cursors
        );
        obj.sprite.pSatellite.setScale(0.5);
        obj.sprite.pSatellite.rotation = Math.PI;
        obj.sprite.pSatellite.enableFilters();

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

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let enemyType = null;
                let enemySprite = null;
                let rand = Math.ceil(Math.random() * 100);

                let x = (j+2) * this.game.config.width/10;
                let y = (i+1) * this.game.config.height/10;

                console.log(rand);

                if (rand < 50) { 
                    enemyType = 2;
                    enemySprite = "meteor";
                    obj.sprite.enemies[j + i * 7] = new Meteor(this, x, y, enemySprite, null, enemyType, 100);
                } else if (rand < 75) {
                    enemyType = 3;
                    enemySprite = "eSatellite";
                    obj.sprite.enemies[j + i * 7] = new LineSatellite(this, x, y, enemySprite, null, enemyType, 100);
                } else if (rand < 90) {
                    enemyType = 1;
                    enemySprite = "sFlare";
                    obj.sprite.enemies[j + i * 7] = new SolarFlare(this, x, y, enemySprite, null, enemyType, 100);
                } else if (rand <= 100) {
                    enemyType = 4;
                    enemySprite = "fuelTank"
                    obj.sprite.enemies[j + i * 7] = new FuelTank(this, x, y, enemySprite, null, enemyType, 100);
                }

                this.remainingEnemies += 1;
                
                if (enemyType == 1) {
                    obj.sprite.enemies[j + i * 7].setScale(1.5);
                } else if (enemyType == 4) {
                    obj.sprite.enemies[j + i * 7].setScale(0.15);
                    obj.sprite.enemies[j + i * 7].rotation = Math.PI;
                } else {
                    obj.sprite.enemies[j + i * 7].setScale(0.5);
                }

                //I'm leaving this here as a small little reminder of my suffering with pathing

                /*if (enemyType != 1) {
                    this.paths[j + i * 7] = [];

                    this.paths[j + i *7].push(
                        x, y,
                    )
                    for (let i2 = i; i2 < 6; i2++) {
                        if (i2 % 2 == 0) {
                            this.paths[j + i * 7].push(
                                x + this.game.config.width * 0.4, y + i2 * this.game.config.height/10,
                                this.game.config.width + x, y + (i2+1) * this.game.config.height/10,
                            )
                        } else {
                            this.paths[j + i * 7].push(
                                x + this.game.config.width * -0.4, y + i2 * this.game.config.height/10,
                                this.game.config.width - x, y + (i2+1) * this.game.config.height/10,
                            )
                        }
                    }

                    this.curves[j + i * 7] = new Phaser.Curves.Spline(this.paths[j + i * 7]);

                    console.log(this.curves[j + i * 7])

                    let initPoint = this.curves[j + i * 7].points[0];
                    if (this.curves[j + i * 7].points[0]) {
                        obj.sprite.enemies[j + i * 7].x = initPoint.x;
                        obj.sprite.enemies[j + i * 7].y = initPoint.y;
                        obj.sprite.enemies[j + i * 7].startFollow({
                            from: 0,
                            to: 1,
                            delay: 0,
                            duration : this.curves[j + i * 7] / 100 * 1000,
                            ease: 'Sine.easeInOut',
                            repeat : -1,
                            yoyo : false,
                            rotateToPath: false,
                        });
                    }
                }*/

            }
        }

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

        this.physics.add.overlap(obj.sprite.pSatellite, obj.sprite.enemies, (obj1, obj2) => {
            this.lives -= 1;
            this.updateLives();

            obj.vfx.destroyedVFX.emitParticleAt(obj2.x, obj2.y, 50);

            this.register_collision(obj2);
        });

        this.physics.add.overlap(obj.sprite.bulletGroup, obj.sprite.enemies, (obj1, obj2) => {
            if (obj1.active == true) {
                obj.vfx.destroyedVFX.emitParticleAt(obj1.x, obj1.y, 50);

                obj1.changeStatus(false);
                this.register_collision(obj2);
            }
        });

        this.restarting = false;


    }

    destroy_game() {
        let obj = this.obj;

        for (let sprite of obj.sprite.enemies) {
            if (sprite != null) {
                sprite.destroy();
                sprite = null;
            }
        }

        for (let sprite of obj.sprite.enemyBullets) {
            if (sprite != null) {
                sprite.destroy();
                sprite = null;
            }
        }

        this.paths = [];
        this.curves = [];
        obj.sprite.pSatellite.destroy();

        for (let sprite of obj.sprite.bulletGroup.getChildren()) {
            sprite.destroy();
        }

        obj.sprite.bulletGroup.clear(true);
    }

    update(t, delta) {

        let obj = this.obj;
        let dt = delta/1000

        if (this.restarting) {
            if (this.restartTimeOut < 2) {
                this.restartTimeOut += dt;
            } else {
                if (this.lives <= 0) {
                    this.scene.pause();
                    this.scene.launch("credits");

                    this.lives = 3;
                    this.updateLives(); 
                }

                obj.text.endText.visible = false;
                this.init_game();
                this.restartTimeOut = 0;
            }
            return;
        } else if (this.remainingEnemies == 0) {
            this.restarting = true;
            this.destroy_game();

            this.stagesclear += 1;
            this.lives += 1;
            this.updateLives();
            obj.sfx.winSound.play();

            
            obj.text.stagesclear.setText("STAGES CLEAR: " + this.stagesclear);
            obj.text.endText.setText("STAGE CLEAR!");
            obj.text.endText.visible = true;
            
            return;
        } else if (this.lives <= 0) {
            this.restarting = true;
            this.destroy_game();

            this.score = 0;
            this.stagesclear = 0;
            obj.sfx.loseSound.play();
            
            obj.text.stagesclear.setText("STAGES CLEAR: " + this.stagesclear);
            this.updateScore();
            obj.text.endText.setText("GAME OVER!");
            obj.text.endText.visible = true;
            
            return;
        }
        
        this.bulletCDCounter -= dt;

        if (this.space.isDown) {
            if (this.bulletCDCounter < 0) {
                let bullet = obj.sprite.bulletGroup.getFirstDead();
                if (bullet != null) {
                    this.bulletCDCounter = this.bulletCD;
                    bullet.changeStatus(true);
                    bullet.x = obj.sprite.pSatellite.x;
                    bullet.y = obj.sprite.pSatellite.y - (obj.sprite.pSatellite.displayHeight/2);
                    bullet.setVel(obj.sprite.pSatellite.angle + 90);
                    bullet.angle = obj.sprite.pSatellite.angle;
                    obj.sfx.laser.play();
                }
            }
        }

        obj.sprite.pSatellite.update(t, delta);

        let directionCheck = false;

        for (let sprite of obj.sprite.enemies) {
            if (sprite != null) {
                sprite.update(t, delta);

                let index = obj.sprite.enemies.indexOf(sprite);

                if (sprite.type == 3 && sprite.attackCooldown <= 0) {
                    let eBullet = new Bullet(this, sprite.x, sprite.y + sprite.displayHeight/2, "eBullet", null, true, 200, sprite.angle)
                    obj.sprite.enemyBullets.push(eBullet);

                    this.physics.add.overlap(obj.sprite.pSatellite, eBullet, (obj1, obj2) => {
                        let index = obj.sprite.enemyBullets.indexOf(obj2)
                        obj.vfx.destroyedVFX.emitParticleAt(obj2.x, obj2.y, 50);
                        obj2.destroy();
                        obj.sprite.enemyBullets[index].y = 1000;

                        this.lives -= 1;
                        obj.sfx.explosion.play()
                        this.updateLives();
                    });

                    sprite.attackCooldown = Math.random() * (4) + 3;
                } else if (sprite.type == 1) {
                    if (sprite.y >= this.game.config.height - 2 * obj.sprite.pSatellite.displayHeight) {
                        if (this.collides(sprite, this.obj.sprite.pSatellite)) {
                            obj.sprite.enemies[index].y = 1000;
                        }
                    }
                }

                if (sprite.type != 1) {
                    if (this.direction > 0) {
                        if (sprite.x > 19 * this.game.config.width/20) {
                            this.direction = -1;
                            directionCheck = true;
                        }
                    } else {
                        if (sprite.x < this.game.config.width/20) {
                            this.direction = 1;
                            directionCheck = true;
                        }
                    }
                }

            }
        }

        if (directionCheck) {
            for (let sprite of obj.sprite.enemies) {
                if (sprite != null && sprite.type != 1) {
                    sprite.y += this.game.config.height/10;
                    if (sprite.y >= this.game.config.height * 9/10) {
                        this.lives = -999;
                    }
                }
            }
        } else {
            for (let sprite of obj.sprite.enemies) {
                if (sprite != null && sprite.type != 1) {
                    sprite.x += this.movementIncrement * dt * this.direction;
                }
            }
        }
        
        obj.sprite.enemyBullets = obj.sprite.enemyBullets.filter((bullet) => bullet.y < (this.game.config.height + bullet.displayHeight/2));

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

        let obj = this.obj
        let spriteType = sprite.type;
        let enemies = obj.sprite.enemies;
        let index = enemies.indexOf(sprite);

        if (spriteType == 1) {
            this.score += 150;
        } else if (spriteType == 2) {
            this.score += 100;
        } else if (spriteType == 3) {
            this.score += 250;
        } else if (spriteType == 4) {
            this.score += 400;
            sprite.onDestroy(enemies);
            /*if (index % 7 != 0 && enemies[index-1] != null && enemies[index-1].type != 1) {
                this.register_collision(enemies[index-1]);
            }
            if (index > 6 && enemies[index-7] != null && enemies[index-7].type != 1) {
                this.register_collision(enemies[index-7]);
            }
            if (index % 7 != 6 && enemies[index+1] != null && enemies[index+1].type != 1) {
                this.register_collision(enemies[index+1]);
            }
            if (index < 35 && enemies[index+7] != null && enemies[index+7 ].type != 1) {
                this.register_collision(enemies[index+7]);
            }*/
        }

        this.updateScore();
        if (enemies[index] != null) {
            sprite.destroy();
            enemies[index] = null;
        }
        obj.sfx.explosion.play();
        this.remainingEnemies -= 1;
    }

    collides(a, b) {
        if (Math.abs(a.x-b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y-b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let obj = this.obj;
        obj.text.score.setText("SCORE: " + this.score);
        console.log(this.score);
        if (this.score > this.highScore) {
            console.log("!!!");
            this.highScore = this.score;
            obj.text.highScore.setText("HIGH SCORE: " + this.highScore);
            localStorage.setItem('highScore', this.highScore);
        }
    }

    updateLives() {
        let obj = this.obj
        obj.text.health.setText("LIVES: " + this.lives)
    }

}