

var total_score;
var game_over;



class Level1 extends LevelBase {
    constructor() { super("level1"); }

    init() {
        this.PLAYER_SPWAN_X = 32;
        this.PLAYER_SPWAN_Y = 220;
        my.info_mode = 0;
        my.key_collected = 0;
        my.power_up = false;
        my.air_jump = 0;
    }

    create() {
        this.create_input();

        // Parallax background
        this.background = this.add.tileSprite(0, 0, 2400, 600, "background1")
            .setOrigin(0)
            .setScale(0.5, 0.5)
            .setScrollFactor(0.2, 1);

        // maps
        this.map = this.add.tilemap('level1', 16, 16, 100, 20, '');
        this.tileset = this.map.addTilesetImage("monochrome_tilemap", "tilemap_tiles");

        // set up ground
        this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0);
        this.groundLayer.setCollisionByProperty( { collides: true });

        this.create_map_animation();

        this.create_player();
        this.create_camera();
        this.create_info();
        this.create_coins();
        this.create_key();
        this.create_spike();
        this.create_door();
        this.craete_dia();
        this.create_jumper();
        this.create_vfx();

        this.scene.launch('ui');
    }

    update() {
        this.update_player()
        this.update_key();
        this.update_particles();
    }
    touch_info() {
        if (my.player.body.x < 520) {
            my.info_mode = 7;
        } else if (my.player.body.x < 250) {
            my.info_mode = 2;
        }
    }

    respwan() {
        my.player.setVelocityX(0);
        my.player.setVelocityY(0);
        my.player.body.x = this.PLAYER_SPWAN_X;
        my.player.body.y = this.PLAYER_SPWAN_Y;
    }
    
    is_on_belt() {
        return (1264 < my.player.x && my.player.x < 1370) &&
                (71.5 < my.player.y && my.player.y < 72.5);
    }
}


class Level12 extends LevelBase {

    init() {
        total_score = 0;
        game_over = false;
    }

    create() {


        this.keys = this.map.createFromObjects("objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 96
        });

        // inputs
        this.create_player();

        this.power_up = false;
        this.air_jump = 0;

        this.game_end = false;
        this.had_key = false;

        this.create_camera();

        // add text to introduce
        this.add.text(450, 200, 'collect diamond to\nenable air jump', 
                { fontFamily: 'Courier', fontSize: 12, color: '#ffffff' });
        this.add.text(1260, 30, 'be careful on\nthe conveyor belt', 
                { fontFamily: 'Courier', fontSize: 12, color: '#ffffff' });

        this.scene.launch('ui');
    }
    
    create_player() {

        

        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGrp = this.add.group(this.keys);
        this.physics.add.overlap(my.player, this.keyGrp, (obj1, obj2) => {
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