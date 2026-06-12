// Aidan Ion
// Created: 6/26
//
// Space Evaders 2 : this time its personal
//
// Final game

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
    scene: [Load, Intro, SpaceEvaders, Credits]
}


const game = new Phaser.Game(config);