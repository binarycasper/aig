import Phaser from "phaser";
import platformImg from "../assets/platform.png";
import playerImg from "../assets/player.png";
import { game, gameOptions } from "../index";

export class playScene extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        this.load.image("platform", platformImg);
        this.load.image("player", playerImg);
    }
    create() {
        this.platformGroup = this.add.group({
            removeCallback: function(platform) {
                platform.scene.platformPool.add(platform);
            }
        });

        this.platformPool = this.add.group({
            removeCallback: function(platform) {
                platform.scene.platformGroup.add(platform);
            }
        });

        this.playerJumps = 0;

        this.addPlatform(
            game.config.width, 
            game.config.width / 2, 
            game.config.height * gameOptions.platformVerticalLimit[1]
        );

        this.player = this.physics.add.sprite(
            gameOptions.playerStartPosition,
            game.config.height / 2,
            "player"
        );
        this.player.setGravityY(gameOptions.playerGravity);

        this.physics.add.collider(this.player, this.platformGroup);

        this.input.on("pointerdown", this.jump, this);
    }

    addPlatform(platformWidth, posX, posY) {
        let platform;
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        } else {
            platform = this.physics.add.sprite(
                posX,
                posY,
                "platform"
            );
            platform.setImmovable(true);
            platform.setVelocityX(Phaser.Math.Between(
                gameOptions.platformSpeedRange[0],
                gameOptions.platformSpeedRange[1])
                * -1);
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(
            gameOptions.spawnRange[0],
            gameOptions.spawnRange[1]
        );
    }

    jump() {
        if (
            this.player.body.touching.down ||
            (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
        ) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps++;
        }
    }

    update() {
        if (this.player.y > game.config.height) {
            this.scene.start("playScene");
        }
        this.player.x = gameOptions.playerStartPosition;

        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform) {
            let platformDistance =
                game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y; 
            }
            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        if (minDistance > this.nextPlatformDistance) {
            let nextPlatformWidth = Phaser.Math.Between(
                gameOptions.platformSizeRange[0],
                gameOptions.platformSizeRange[1]
            );
            let platformRandomHeight = gameOptions.platformHeightScale * Phaser.Math.Between(
                gameOptions.platformHeightRange[0],
                gameOptions.platformHeightRange[1]
            );
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight; 
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(
                nextPlatformGap,
                minPlatformHeight,
                maxPlatformHeight,
            ); 
            this.addPlatform(
                nextPlatformWidth,
                game.config.width + nextPlatformWidth / 2,
                nextPlatformHeight
            );
        }
    }
}
