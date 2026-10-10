/**
 * Phaser 3 Game Configuration
 * Responsive virtual canvas scaled cleanly for Desktop, Tablet, and Mobile.
 */

import Phaser from 'phaser';
import { GameScene } from './GameScene';

export function createPhaserGame(
  parentContainer: HTMLElement,
  startData: { levelIndex: number; score?: number; crystals?: number } = { levelIndex: 0 }
): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parentContainer,
    width: 800,
    height: 450,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#030712',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 450,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  };

  const game = new Phaser.Game(config);
  game.scene.add('GameScene', GameScene, false);
  game.events.once(Phaser.Core.Events.READY, () => {
    game.scene.start('GameScene', startData);
  });

  return game;
}
