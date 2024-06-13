

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

    is_on_belt() {
        return (1264 < my.player.x && my.player.x < 1370) &&
                (71.5 < my.player.y && my.player.y < 72.5);
    }
    
    end_scene() {
        my.info_mode = 8;
    }
}


