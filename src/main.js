// Aidan Ion
// Created: 5/4/26
//
// Space Evaders
//
// Gallery shooter game

// Art assets from Kenny Assets:
// https://kenney.nl/assets/

"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 800,
    height: 600,
    scene: [Load, SpaceEvaders]
}


const game = new Phaser.Game(config);