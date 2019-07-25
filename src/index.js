import Phaser from "phaser";

import { playScene } from "./scenes/playScene";

export let game;

export let gameOptions = {
    platformSpeedRange: [300, 400],
    spawnRange: [100, 350],
    platformSizeRange: [50, 250],
    platformHeightRange: [-10, 10],
    platformHeightScale: 10,
    platformVerticalLimit: [0.4, 0.8],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2
};

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        scene: playScene,
        backgroundColor: 0x444444,

        physics: {
            default: "arcade"
        }
    };

    game = new Phaser.Game(gameConfig);
};
