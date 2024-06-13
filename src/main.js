// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,  // TODO turn off
            gravity: {
                x: 0,
                y: 1500
            }
        }
    },
    width: 1440,
    height: 900,
    scene: [Load, Level0, Level1, UI]
}

// const values
const CAMERA_ZOOM = 3.5;
const PLAYER_ACCELERATION_X = 450;
const PLAYER_DRAG = 550;
const PLAYER_MAX_SPEED = 120;
//const PLAYER_MAX_SPEED = 1000;
const PLAYER_JUMP_VELOCITY = -420;

var cursors;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);
