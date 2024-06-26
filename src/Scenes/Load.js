

class Load extends Phaser.Scene {
    constructor() {
        super("load");
    }
    
    preload() {
        this.load.setPath("./assets/");
        
        // tilemap
        let tilemap = 'monochrome_tilemap_transparent_packed.png'
        this.load.image('tilemap_tiles', tilemap);
        this.load.spritesheet('tilemap_sheet', tilemap, {
            frameWidth: 16, 
            frameWidth: 16
        });

        // map
        this.load.tilemapTiledJSON('level0', 'level0.tmj');
        this.load.tilemapTiledJSON('level1', 'level1.tmj');
        
        // particles
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    
        // background
        this.load.image('background0', 'background0.png');
        this.load.image('background1', 'background1.png');
        
        // audio
        this.load.audio('coin', 'beltHandle1.ogg');
        this.load.audio('door', 'doorOpen_1.ogg');
        this.load.audio('dia', 'jingles_NES03.ogg');
        this.load.audio('key', 'jingles_NES06.ogg');
        this.load.audio('kill', 'impactBell_heavy_001.ogg');
        this.load.audio('jumper', 'impactBell_heavy_003.ogg');
    }
    
    create() {
        this.create_animes()
 
        // init variables
        my.total_score = 0;

        // start game
        this.scene.start('level0');
    }

    create_animes() {
        // char anims
        this.anims.create({
            key: 'idle',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 240}
            ],
            repeat: -1
        })

        this.anims.create({
            key: 'walk',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 241},
                {frame: 242},
                {frame: 243},
                {frame: 244},
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 245}
            ],
            repeat: -1
        })

        this.anims.create({
            key: 'crouch',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 246}
            ],
            repeat: -1
        })

        // fans
        this.anims.create({
            key: 'fan_a',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 369},
                {frame: 370},
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'fan_b',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 349},
                {frame: 350},
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'dia',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 82},
                {frame: 102},
            ],
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'jumper',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 165},
                {frame: 164},
                {frame: 163},
            ],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'door_left',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 78},
                {frame: 98},
            ],
            frameRate: 2,
            repeat: 0
        })

        this.anims.create({
            key: 'door_right',
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 79},
                {frame: 99},
            ],
            frameRate: 2,
            repeat: 0
        })

        this.anims.create({
            key: 'coin',
            random: true,
            defaultTextureKey: 'tilemap_sheet',
            frames: [
                {frame: 1},
                {frame: 20},
            ],
            frameRate: 10,
            repeat: -1
        })
    }

    update() {}
}