

class UI extends Phaser.Scene {
    constructor() {
        super({ key: 'ui' });
    }

    create() {
        this.scoreText = this.add.text(16, 16, 'score: 0',
        {fontFamily: 'Courier', fontSize:'32px', fill:'#FFFFFF'});
    }

    update() {
        let score_part = 'score: ' + my.total_score;
        let info_part;
        switch (my.info_mode) {
        case 0:
            info_part = '';
            break;
        case 1:
            info_part = 'Use ← and → to move';
            break;
        case 2:
            info_part = 'Use ↑ to jump';
            break;
        case 3:
            info_part = 'Use ↓ to duck';
            break;
        case 4:
            info_part = 'Eat coin for score';
            break;
        case 5:
            info_part = 'Be careful around spikes!';
            break;
        case 6:
            info_part = 'Take the key to unlock door';
            break;
        case 7:
            info_part = 'The diamond allow you to air jump';
            break;
        case 8:
            info_part = '\n\nEND of Game\nThanks for Playing';
            break;
        }
        this.scoreText.setText(score_part + '\n' + info_part);
    }    
}
