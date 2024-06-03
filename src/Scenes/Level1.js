

var total_score;
var game_over;


const WORLD_GRAVITY = 1500;
const ACCELERATION_X = 450;
const PLAYER_DRAG = 550;
const PLAYER_MAX_SPEED = 120;
const JUMP_VELOCITY = -420;
const CAMERA_ZOOM = 3.5


class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    init() {
        this.physics.world.gravity.y = WORLD_GRAVITY;
        this.PLAYER_SPWAN_X = 32;
        this.PLAYER_SPWAN_Y = 220;
        total_score = 0;
        game_over = false;
    }

    create() {
        this.create_map();
        this.create_setup_input();

        this.create_player();
        this.create_camera();

        this.power_up = false;
        this.air_jump = 0;

        this.scene.launch('ui');
        this.game_end = false;
        this.had_key = false;

        // add text to introduce
        this.add.text(450, 200, 'collect diamond to\nenable air jump', 
                { fontFamily: 'Courier', fontSize: 12, color: '#ffffff' });
        this.add.text(1260, 30, 'be careful on\nthe conveyor belt', 
                { fontFamily: 'Courier', fontSize: 12, color: '#ffffff' });
    }

    create_map() {
        // Parallax background
        this.background = this.add.tileSprite(0, 0, 2400, 600, "background1")
            .setOrigin(0)
            .setScale(0.5, 0.5)
            .setScrollFactor(0.2, 1); //this line keeps your background from scrolling outside of camera bounds

        // create map
        this.map = this.add.tilemap('level1', 16, 16, 100, 20, '');
        this.tileset = this.map.addTilesetImage("monochrome_tilemap", "tilemap_tiles");
        
        // set up ground
        this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0);
        this.groundLayer.setCollisionByProperty( {
            collides: true
        });
    
        // set up fancs
        my.sprite.fan_a = this.map.createFromObjects("objects", {
            name: 'fan_a',
            key: 'tilemap_sheet',
            frame: 367
        })

        for (let fan of my.sprite.fan_a) {
            fan.anims.play('fan_a');
        }
        my.sprite.fan_b = this.map.createFromObjects("objects", {
            name: 'fan_b',
            key: 'tilemap_sheet',
            frame: 349
        })

        for (let fan of my.sprite.fan_b) {
            fan.anims.play('fan_b');
        }
        
        this.create_dia();

        my.sprite.jumper = this.map.createFromObjects("objects", {
            name: 'jump',
            key: 'tilemap_sheet',
            frame: 163
        })

        my.sprite.door_left = this.map.createFromObjects("objects", {
            name: 'door_left',
            key: 'tilemap_sheet',
            frame: 78
        })

        my.sprite.door_right = this.map.createFromObjects("objects", {
            name: 'door_right',
            key: 'tilemap_sheet',
            frame: 79
        })


        this.coins = this.map.createFromObjects("objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 1
        });


        for (let coin of this.coins) {
            coin.anims.play('coin');
        }


        this.keys = this.map.createFromObjects("objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 96
        });

    }
    
    create_dia() {
        // create dias
        my.sprite.dias = this.map.createFromObjects("objects", {
            name: 'dia',
            key: 'tilemap_sheet',
            frame: 82
        })

        for (let dia of my.sprite.dias) {
            dia.anims.play('dia');
        }


        my.vfx.power_up = this.add.particles(0, 0, 'kenny-particles', {
            frame: ['star_01.png', 'star_08.png', 'star_06.png'],
            random: true,
            scale: {start: 0.1, end: 0.5},
            maxAliveParticles: 1,
            alpha: {start: 0.5, end: 0.01}, 
            lifespan: 350,
        })

        my.vfx.power_up.stop();
    }

    create_setup_input() {
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
    }
    
    create_camera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, 
                this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 0);
        this.cameras.main.setZoom(CAMERA_ZOOM);
        
    }
    
    create_player() {
        my.sprite.player = this.physics.add.sprite(
                this.PLAYER_SPWAN_X, this.PLAYER_SPWAN_Y,
                "tilemap_sheet", 240)
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.body.setMaxVelocityX(PLAYER_MAX_SPEED);
        
        // add collision w/ ground
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        my.sprite.player.anims.play('idle');

        // collide with dia
        this.physics.world.enable(my.sprite.dias,
                Phaser.Physics.Arcade.STATIC_BODY);

        this.diasGroup = this.add.group(my.sprite.dias);

        this.physics.add.overlap(my.sprite.player, this.diasGroup, (obj1, obj2) => {
            this.power_up_do();
        });
        
        // collide with jumper
        this.physics.world.enable(my.sprite.jumper,
                Phaser.Physics.Arcade.STATIC_BODY);

        this.jumperGrp = this.add.group(my.sprite.jumper);

        this.physics.add.overlap(my.sprite.player, this.jumperGrp, (obj1, obj2) => {
            obj1.setVelocityY(JUMP_VELOCITY*2);
            obj2.anims.play('jumper');
        });
        
        // collide with door left
        this.physics.world.enable(my.sprite.door_left,
                Phaser.Physics.Arcade.STATIC_BODY);

        this.door_lefts = this.add.group(my.sprite.door_left);

        this.physics.add.overlap(my.sprite.player, this.door_lefts, (obj1, obj2) => {
            this.end_game();
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            total_score += 1;
            this.sound.play('coin');
        });
        
        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGrp = this.add.group(this.keys);
        this.physics.add.overlap(my.sprite.player, this.keyGrp, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.had_key = true;
            this.sound.play('key')
        });
        
    }
    
    power_up_do() {
        if (this.power_up) {return;}
        this.power_up = true;
        this.sound.play('dia');
        
    }

    update() {
        this.update_player();
    }
    

    update_player() {
        // horizontal mvmt
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-ACCELERATION_X);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

       } else if(cursors.right.isDown) {
            if (this.is_on_belt()) {
                my.sprite.player.setAccelerationX(ACCELERATION_X*0.1);
            } else {
                my.sprite.player.setAccelerationX(ACCELERATION_X);
            }
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if (cursors.down.isDown) {
            my.sprite.player.anims.play('crouch');
        } else {
            // Set acceleration to 0 and have DRAG take over
            if (this.is_on_belt()) {
                my.sprite.player.setVelocityX(-50);
            } else {
                my.sprite.player.setAccelerationX(0);
            }
            my.sprite.player.setDragX(PLAYER_DRAG);
            my.sprite.player.anims.play('idle');
        }
        
        // vertical mvmt
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if(my.sprite.player.body.blocked.down) {
                my.sprite.player.body.setVelocityY(JUMP_VELOCITY);
                
                if (this.power_up) {this.air_jump = 1;}

            } else if (this.air_jump > 0) {
                my.sprite.player.body.setVelocityY(JUMP_VELOCITY*0.9);
                this.air_jump = 0;
            }
        }

        // power up vfx
        if (this.power_up) {
            my.vfx.power_up.startFollow(my.sprite.player, 
    my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            
            my.sprite.dias[0].visible = false;
            my.vfx.power_up.start();
        } else {
        
        my.sprite.dias[0].visible = true;
        }


    }
    
    is_on_belt() {
        return (1264 < my.sprite.player.x && my.sprite.player.x < 1370) &&
                (71.5 < my.sprite.player.y && my.sprite.player.y < 72.5);
    }
    
    end_game() {
        if (!this.had_key || game_over) {return;}
        game_over = true;

        this.sound.play('door');

        for (let fan of my.sprite.door_left) {
            fan.anims.play('door_left');
        }
        for (let fan of my.sprite.door_right) {
            fan.anims.play('door_right');
        }
        this.sound.play('door');
        
    }
}


class UI extends Phaser.Scene {
    constructor() {
        super({ key: 'ui' });
    }

    create() {
        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSzie:'32px', fill:'#FFFFFF'});
    }

    update() {
        if (game_over) {
            this.scoreText.setText('Thanks for playing,\nyour final score is: ' + total_score);
        } else {
            this.scoreText.setText('score: ' + total_score);
        }
    }    
}