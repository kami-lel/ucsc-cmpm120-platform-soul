
class Level0 extends LevelBase {
    constructor() {
        super("level0");
    }

    init() {
        this.PLAYER_SPWAN_X = 32;
        this.PLAYER_SPWAN_Y = 220;
        my.info_mode = 0;
        my.key_collected = 0;
    }

    create() {
        this.create_input();

        // Parallax background
        this.background = this.add.tileSprite(0, 0, 2400, 600, "background0")
            .setOrigin(0)
            .setScale(0.5, 0.5)
            .setScrollFactor(0.2, 1); //this line keeps your background from scrolling outside of camera bounds

        // map
        this.map = this.add.tilemap('level0', 16, 16, 100, 20, '');
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "tilemap_tiles");

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

        this.scene.launch('ui');
    }

    update() {
        this.update_player();
        this.update_key();
    }

    touch_info() {
        if (my.player.body.x < 150) {
            my.info_mode = 1;
        } else if (my.player.body.x < 250) {
            my.info_mode = 2;
        } else if (my.player.body.x < 350) {
            my.info_mode = 3;
        } else if (my.player.body.x < 450) {
            my.info_mode = 4;
        } else if (my.player.body.x < 980) {
            my.info_mode = 5;
        } else if (my.player.body.x < 1130) {
            my.info_mode = 6;
        }
    }

    respwan() {
        my.player.setVelocityX(0);
        my.player.setVelocityY(0);
        my.player.body.x = this.PLAYER_SPWAN_X;
        my.player.body.y = this.PLAYER_SPWAN_Y;
    }
    
    end_scene() {
        this.time.delayedCall(1500, () => {
            this.scene.start('level1')
        })
    }

}
