import 'phaser';

import { playScene } from './scenes/playScene';

export let game;

export let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [100, 350],
    platformSizeRange: [50, 250],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2
}

window.onload = function() {
    let gameConfig ={
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        scene: playScene,
        backgroundColor: 0x444444,

        physics: {
            default: "arcade"
        }
    }

    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("rezise", resize, false);
}

function resize(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth/windowHeight;
    let gameRatio = game.config.width/game.config.height;
    if(windowRatio<gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth/gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px"; 
    }
}