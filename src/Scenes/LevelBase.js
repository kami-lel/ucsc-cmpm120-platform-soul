
class LevelBase extends Phaser.Scene {

    create_input() {
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
    }

    create_camera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, 
                this.map.heightInPixels);
        this.cameras.main.startFollow(my.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 0);
        this.cameras.main.setZoom(CAMERA_ZOOM);
    }

    create_map_animation() {
        // set up fans
        my.sprite.fan_a = this.map.createFromObjects("objects", {
            name: 'fan_a',
            key: 'tilemap_sheet',
            frame: 367
        })
        for (let fan of my.sprite.fan_a) { fan.anims.play('fan_a'); }

        my.sprite.fan_b = this.map.createFromObjects("objects", {
            name: 'fan_b',
            key: 'tilemap_sheet',
            frame: 349
        })
        for (let fan of my.sprite.fan_b) { fan.anims.play('fan_b'); }
    }

    create_coins() {
        my.sprite.coins = this.map.createFromObjects("objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 1
        });

        for (let coin of my.sprite.coins) { coin.anims.play('coin'); }

        this.physics.world.enable(my.sprite.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(my.sprite.coins);
        this.physics.add.overlap(my.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            my.total_score += 1;
            this.sound.play('coin');
        });

    }

    create_player() {
        my.player = this.physics.add.sprite(
                this.PLAYER_SPWAN_X, this.PLAYER_SPWAN_Y,
                "tilemap_sheet", 240)
        my.player.setCollideWorldBounds(true);
        my.player.body.setMaxVelocityX(PLAYER_MAX_SPEED);
        
        // add collision w/ ground
        this.physics.add.collider(my.player, this.groundLayer);

        my.player.anims.play('idle');
    }

    create_info() {
        my.sprite.infos = this.map.createFromObjects("objects", {
            name: "info",
            key: "tilemap_sheet",
            frame: 204
        });

        this.physics.world.enable(my.sprite.infos,
                Phaser.Physics.Arcade.STATIC_BODY);
    
        this.physics.add.overlap(my.player, my.sprite.infos, (obj1, obj2) => {
            this.touch_info();
        });
    }

    create_spike() {
        my.sprite.spikes = this.map.createFromObjects("objects", {
            name: "spike",
            key: "tilemap_sheet",
            frame: 183
        });

        this.physics.world.enable(my.sprite.spikes,
                Phaser.Physics.Arcade.STATIC_BODY);
    
        this.physics.add.overlap(my.player, my.sprite.spikes, (obj1, obj2) => {
            this.respwan();
            // TODO play sound
        });
    }

    create_key() {
        my.sprite.key = this.map.createFromObjects("objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 96
        });

        this.physics.world.enable(my.sprite.key,
                Phaser.Physics.Arcade.STATIC_BODY);
    
        this.physics.add.overlap(my.player, my.sprite.key, (obj1, obj2) => {
            my.key_collected = true;
            my.follow_key.body.x = my.player.body.x;
            my.follow_key.body.y = my.player.body.y;
            obj2.destroy();
    
        });

        // create follow key
        my.follow_key = this.physics.add.sprite(
                this.PLAYER_SPWAN_X, this.PLAYER_SPWAN_Y,
                "tilemap_sheet", 97)
        my.player.setCollideWorldBounds(true);
        // add collision w/ ground
        this.physics.add.collider(my.follow_key, this.groundLayer);
    }

    create_door() {
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

        // collide with door left
        this.physics.world.enable(my.sprite.door_left,
                Phaser.Physics.Arcade.STATIC_BODY);

        this.door_lefts = this.add.group(my.sprite.door_left);

        this.physics.add.overlap(my.player, this.door_lefts, (obj1, obj2) => {
            if (my.key_collected==1) {
                my.key_collected = 2;

                this.sound.play('door');

                for (let door of my.sprite.door_left) {
                    door.anims.play('door_left');
                }
                for (let door of my.sprite.door_right) {
                    door.anims.play('door_right');
                }
                
                this.end_scene();
            }
        });
    }

    craete_dia() {
        my.sprite.dias = this.map.createFromObjects("objects", {
            name: 'dia',
            key: 'tilemap_sheet',
            frame: 82
        })

        for (let dia of my.sprite.dias) { dia.anims.play('dia'); }
        
        // collide with dia
        this.physics.world.enable(my.sprite.dias,
                Phaser.Physics.Arcade.STATIC_BODY);

        this.diasGroup = this.add.group(my.sprite.dias);

        this.physics.add.overlap(my.player, this.diasGroup, (obj1, obj2) => {
            obj2.destroy();
            my.power_up = true;
        });
    }

    create_jumper() {
        my.sprite.jumper = this.map.createFromObjects("objects", {
            name: 'jump',
            key: 'tilemap_sheet',
            frame: 163
        })

        // collide with jumper
        this.physics.world.enable(my.sprite.jumper,
                Phaser.Physics.Arcade.STATIC_BODY);

        this.jumperGrp = this.add.group(my.sprite.jumper);

        this.physics.add.overlap(my.player, this.jumperGrp, (obj1, obj2) => {
            obj1.setVelocityY(PLAYER_JUMP_VELOCITY*2);
            obj2.anims.play('jumper');
        });
        
    }

    create_vfx() {
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
 
    update_player() {
        // horizontal mvmt
        if(cursors.left.isDown) {
            my.player.setAccelerationX(-PLAYER_ACCELERATION_X);
            my.player.setFlip(true, false);
            my.player.anims.play('walk', true);

       } else if(cursors.right.isDown) {
            if (this.is_on_belt()) {
                my.player.setAccelerationX(PLAYER_ACCELERATION_X*0.1);
            } else {
                my.player.setAccelerationX(PLAYER_ACCELERATION_X);
            }
            my.player.resetFlip();
            my.player.anims.play('walk', true);

        } else if (cursors.down.isDown) {
            my.player.anims.play('crouch');
        } else {
            // Set acceleration to 0 and have DRAG take over
            if (this.is_on_belt()) {
                my.player.setVelocityX(-50);
            } else {
                my.player.setAccelerationX(0);
            }
            my.player.setDragX(PLAYER_DRAG);
            my.player.anims.play('idle');
        }

        // vertical mvmt
        if(!my.player.body.blocked.down) {
            my.player.anims.play('jump');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if(my.player.body.blocked.down) {
                my.player.body.setVelocityY(PLAYER_JUMP_VELOCITY);
                
                if (my.power_up) {my.air_jump = 1;}

            } else if (my.air_jump > 0) {
                my.player.body.setVelocityY(PLAYER_JUMP_VELOCITY*0.9);
                my.air_jump = 0;
            }
        }

    }

    update_key() {
        if (my.key_collected == 1) {
            my.follow_key.visible = true;
            let delta_x = my.player.body.x - 15 - my.follow_key.body.x;
            let delta_y = my.player.body.y - 20 - my.follow_key.body.y;
            my.follow_key.setVelocityX(delta_x * 3);
            my.follow_key.setVelocityY(delta_y * 3);

        } else {
            my.follow_key.visible = false;
        }
    }

    update_particles() {
        // power up vfx
        if (my.power_up) {
            my.vfx.power_up.startFollow(my.player, 
    my.player.displayWidth/2-10, my.player.displayHeight/2-5, false);
            my.sprite.dias[0].visible = false;
            my.vfx.power_up.start();
        }
    }
 

 }