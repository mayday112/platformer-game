/**
 * Procedural Pixel Art Texture Generator for Phaser 3
 * Generates high-fidelity 16-bit anime fantasy pixel art sprites
 * with crisp pixel rendering, animations, and zero external network latency.
 */

import Phaser from 'phaser';

export function generateGameTextures(scene: Phaser.Scene) {
  const textures = scene.textures;

  // Helper to draw a pixel grid onto a canvas
  const createPixelTexture = (
    key: string,
    width: number,
    height: number,
    pixelDrawer: (ctx: CanvasRenderingContext2D) => void
  ) => {
    if (textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    pixelDrawer(ctx);
    textures.addCanvas(key, canvas);
  };

  // Helper to set pixel with coordinate scaling
  const p = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, w = 1, h = 1) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  // 1. TILES
  // 1.1 Grass / Mossy stone top (16x16)
  createPixelTexture('tile_grass', 16, 16, (ctx) => {
    // Base stone
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 0, 16, 16);
    // Stone brick lines
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 7, 16, 1);
    ctx.fillRect(7, 0, 1, 7);
    ctx.fillRect(12, 8, 1, 8);
    // Stone highlights
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(1, 1, 6, 1);
    ctx.fillRect(8, 1, 7, 1);
    ctx.fillRect(1, 8, 10, 1);
    // Lush fantasy grass top
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 16, 3);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(0, 0, 16, 1);
    // Moss drips
    ctx.fillStyle = '#059669';
    ctx.fillRect(2, 3, 2, 2);
    ctx.fillRect(7, 3, 3, 3);
    ctx.fillRect(13, 3, 2, 1);
    // Tiny glowing flower
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(4, 0, 2, 1);
  });

  // 1.2 Subterranean Stone Brick (16x16)
  createPixelTexture('tile_stone', 16, 16, (ctx) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 7, 16, 1);
    ctx.fillRect(0, 15, 16, 1);
    ctx.fillRect(8, 0, 1, 7);
    ctx.fillRect(3, 8, 1, 7);
    // Cracks & texture
    ctx.fillStyle = '#334155';
    ctx.fillRect(1, 1, 6, 1);
    ctx.fillRect(9, 1, 6, 1);
    ctx.fillRect(4, 9, 10, 1);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(2, 3, 2, 1);
  });

  // 1.3 Crystal Brick (16x16)
  createPixelTexture('tile_crystal', 16, 16, (ctx) => {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(3, 3, 10, 10);
    ctx.fillStyle = '#a5b4fc';
    ctx.fillRect(4, 4, 3, 3);
    ctx.fillStyle = '#c7d2fe';
    ctx.fillRect(4, 4, 1, 1);
    // Rune mark
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(8, 8, 2, 2);
  });

  // 1.4 Spikes (16x16)
  createPixelTexture('tile_spikes', 16, 16, (ctx) => {
    // 3 sharp crystal thorn spikes
    const drawSpike = (x: number) => {
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(x + 2, 14, 2, 2);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + 1, 8, 4, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + 2, 3, 2, 5);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(x + 2, 1, 1, 2);
    };
    drawSpike(0);
    drawSpike(5);
    drawSpike(10);
  });

  // 1.5 Bouncy Mushroom / Jump Pad (20x16)
  createPixelTexture('spring_pad', 20, 16, (ctx) => {
    // Stem
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(8, 9, 4, 7);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 9, 1, 7);
    // Cap
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(3, 3, 14, 7);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(5, 1, 10, 3);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(6, 1, 8, 1);
    // Glowing spots
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(6, 4, 2, 2);
    ctx.fillRect(12, 4, 2, 2);
    ctx.fillRect(9, 2, 2, 2);
  });

  // 1.6 Moving Platform Slab (48x16)
  createPixelTexture('moving_platform', 48, 16, (ctx) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 48, 16);
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 2, 44, 12);
    // Edge gold/silver trim
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 0, 48, 2);
    ctx.fillRect(0, 14, 48, 2);
    // Glowing runes in center
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(14, 6, 4, 4);
    ctx.fillRect(22, 5, 4, 6);
    ctx.fillRect(30, 6, 4, 4);
  });

  // 1.7 Crumbling Platform (32x14)
  createPixelTexture('crumbling_platform', 32, 14, (ctx) => {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 0, 32, 14);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(1, 1, 30, 12);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(2, 2, 28, 2);
    // Cracks
    ctx.fillStyle = '#292524';
    ctx.fillRect(8, 2, 2, 8);
    ctx.fillRect(18, 4, 2, 9);
  });

  // 2. ITEMS & PICKUPS
  // 2.1 Mana Crystal (16x16)
  createPixelTexture('crystal_item', 16, 16, (ctx) => {
    // Diamond crystal
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(7, 1, 2, 14);
    ctx.fillRect(5, 3, 6, 10);
    ctx.fillRect(3, 5, 10, 6);
    // Facet highlights
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(6, 3, 3, 9);
    ctx.fillRect(4, 6, 7, 4);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(7, 4, 2, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, 5, 1, 2);
  });

  // 2.2 Health Potion / Heart (16x16)
  createPixelTexture('potion_item', 16, 16, (ctx) => {
    // Red heart
    ctx.fillStyle = '#be123c';
    ctx.fillRect(2, 3, 5, 4);
    ctx.fillRect(9, 3, 5, 4);
    ctx.fillRect(2, 6, 12, 4);
    ctx.fillRect(4, 10, 8, 3);
    ctx.fillRect(6, 13, 4, 2);
    ctx.fillRect(7, 15, 2, 1);
    // Gloss highlight
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(3, 4, 2, 2);
    ctx.fillRect(4, 6, 1, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, 4, 1, 1);
  });

  // 2.3 Golden Key (16x16)
  createPixelTexture('key_item', 16, 16, (ctx) => {
    ctx.fillStyle = '#b45309';
    // Ring bow
    ctx.fillRect(2, 2, 7, 7);
    ctx.fillStyle = '#00000000';
    ctx.clearRect(4, 4, 3, 3);
    // Shaft
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(3, 3, 5, 5);
    ctx.fillStyle = '#00000000';
    ctx.clearRect(4, 4, 3, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, 5, 7, 3);
    // Teeth
    ctx.fillRect(11, 8, 2, 3);
    ctx.fillRect(14, 8, 2, 4);
    // Sparkle
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(4, 2, 2, 1);
  });

  // 2.4 Checkpoint Shrine Inactive (16x28)
  createPixelTexture('checkpoint_off', 16, 28, (ctx) => {
    // Stone base
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 20, 12, 8);
    // Pillar
    ctx.fillStyle = '#475569';
    ctx.fillRect(4, 8, 8, 12);
    // Inactive gem
    ctx.fillStyle = '#64748b';
    ctx.fillRect(6, 2, 4, 5);
  });

  // 2.5 Checkpoint Shrine Activated (16x28)
  createPixelTexture('checkpoint_on', 16, 28, (ctx) => {
    // Stone base
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 20, 12, 8);
    // Pillar with blue rune lines
    ctx.fillStyle = '#475569';
    ctx.fillRect(4, 8, 8, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(7, 10, 2, 8);
    // Active floating glowing crystal
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(5, 1, 6, 7);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(6, 2, 4, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, 3, 2, 2);
  });

  // 2.6 Mystic Gate Locked (32x48)
  createPixelTexture('gate_locked', 32, 48, (ctx) => {
    // Stone frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 48);
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 4, 24, 44);
    // Archway opening
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, 10, 16, 38);
    // Locked magic barrier
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(9, 11, 14, 37);
    ctx.fillStyle = '#a855f7';
    // Lock symbol / runes
    ctx.fillRect(13, 22, 6, 7);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(14, 25, 4, 4);
    ctx.fillRect(15, 29, 2, 1);
  });

  // 2.7 Mystic Gate Opened (32x48)
  createPixelTexture('gate_open', 32, 48, (ctx) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 48);
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 4, 24, 44);
    // Swirling starry portal
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(8, 10, 16, 38);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(10, 14, 12, 30);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(12, 18, 8, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14, 24, 4, 10);
  });

  // 3. PROJECTILES & COMBAT FX
  // 3.1 Player Rune Magic Blast (12x12)
  createPixelTexture('bullet_magic', 12, 12, (ctx) => {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(2, 2, 8, 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(3, 3, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 4, 4, 4);
  });

  // 3.2 Enemy Shadow Orb (12x12)
  createPixelTexture('bullet_enemy', 12, 12, (ctx) => {
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(2, 2, 8, 8);
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(3, 3, 6, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(5, 5, 2, 2);
  });

  // 3.3 Sword Slash Crescent FX (24x24)
  createPixelTexture('slash_fx', 24, 24, (ctx) => {
    ctx.fillStyle = '#38bdf8';
    // Crescent blade curve
    ctx.beginPath();
    ctx.arc(8, 12, 12, -Math.PI / 2.5, Math.PI / 2.5, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(10, 12, 9, -Math.PI / 2.5, Math.PI / 2.5, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  });

  // 3.4 Particle Sparkle (6x6)
  createPixelTexture('particle_sparkle', 6, 6, (ctx) => {
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(2, 0, 2, 6);
    ctx.fillRect(0, 2, 6, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 2, 2, 2);
  });

  // 4. PLAYER HERO: "LYRA" (Azure-haired Rune Knight)
  // Sprite size: 24x30 pixels. We create:
  // - player_idle_0, player_idle_1
  // - player_run_0, player_run_1, player_run_2, player_run_3
  // - player_jump
  // - player_fall
  // - player_slash
  // - player_dash

  const drawLyraBase = (
    ctx: CanvasRenderingContext2D,
    legOffset: number = 0,
    swordAngle: number = 0,
    capeFlutter: number = 0,
    isSlashing: boolean = false
  ) => {
    // Cape behind (navy & cyan trim)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(6 - capeFlutter, 14, 5, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(6 - capeFlutter, 25, 5, 1);

    // Legs / Boots (Silver/dark armor)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(9 - legOffset, 22, 3, 8);
    ctx.fillRect(13 + legOffset, 22, 3, 8);
    // Silver boot caps
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(9 - legOffset, 27, 4, 3);
    ctx.fillRect(13 + legOffset, 27, 4, 3);

    // Torso: Silver Armor Breastplate + glowing blue rune
    ctx.fillStyle = '#475569';
    ctx.fillRect(8, 12, 9, 10);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(9, 13, 7, 8);
    ctx.fillStyle = '#38bdf8'; // Glowing rune core
    ctx.fillRect(11, 15, 3, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 16, 1, 2);

    // Pauldrons (shoulder pads)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(6, 12, 3, 3);
    ctx.fillRect(16, 12, 3, 3);

    // Head / Face: Anime face
    ctx.fillStyle = '#fed7aa'; // Fair skin tone
    ctx.fillRect(9, 5, 7, 7);
    // Anime eyes (sparkling blue)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(13, 7, 2, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14, 7, 1, 1);
    // Cute blush
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(12, 10, 2, 1);

    // Sapphire Blue Hair (Volume, bangs & side strands)
    ctx.fillStyle = '#1d4ed8'; // Shadow hair
    ctx.fillRect(7, 2, 11, 6);
    ctx.fillStyle = '#2563eb'; // Main hair
    ctx.fillRect(8, 1, 9, 6);
    ctx.fillRect(6, 5, 3, 7);
    ctx.fillRect(15, 4, 3, 6);
    // Bangs
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(9, 4, 5, 2);
    ctx.fillRect(11, 6, 2, 1);
    // White hair ribbon
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(6, 2, 2, 2);

    // Sword & Hand
    if (isSlashing) {
      // Extended slash forward
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(16, 12, 7, 3);
      // Sword blade glowing
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(18, 10, 5, 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(19, 11, 4, 5);
    } else {
      // Normal sword at side / hip
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(16, 14 + swordAngle, 2, 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(17, 15 + swordAngle, 1, 7);
      // Sword pommel / guard
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(15, 14 + swordAngle, 4, 2);
    }
  };

  // Player Idle 0
  createPixelTexture('player_idle_0', 24, 30, (ctx) => {
    drawLyraBase(ctx, 0, 0, 0, false);
  });
  // Player Idle 1 (subtle breath bob)
  createPixelTexture('player_idle_1', 24, 30, (ctx) => {
    drawLyraBase(ctx, 0, 1, 1, false);
  });

  // Player Run frames
  createPixelTexture('player_run_0', 24, 30, (ctx) => {
    drawLyraBase(ctx, 2, -1, 1, false);
  });
  createPixelTexture('player_run_1', 24, 30, (ctx) => {
    drawLyraBase(ctx, 0, 0, 2, false);
  });
  createPixelTexture('player_run_2', 24, 30, (ctx) => {
    drawLyraBase(ctx, -2, 1, 1, false);
  });
  createPixelTexture('player_run_3', 24, 30, (ctx) => {
    drawLyraBase(ctx, 0, 0, 0, false);
  });

  // Player Jump
  createPixelTexture('player_jump', 24, 30, (ctx) => {
    drawLyraBase(ctx, 1, -3, 3, false);
  });
  // Player Fall
  createPixelTexture('player_fall', 24, 30, (ctx) => {
    drawLyraBase(ctx, -1, 2, -1, false);
  });
  // Player Slash
  createPixelTexture('player_slash', 24, 30, (ctx) => {
    drawLyraBase(ctx, 0, 0, 1, true);
  });
  // Player Dash
  createPixelTexture('player_dash', 24, 30, (ctx) => {
    drawLyraBase(ctx, 3, -2, 4, false);
    // Cyan speed aura lines
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(1, 10, 4, 1);
    ctx.fillRect(0, 16, 5, 1);
    ctx.fillRect(2, 22, 4, 1);
  });

  // 5. ENEMIES
  // 5.1 Slime (18x14)
  createPixelTexture('slime_0', 18, 14, (ctx) => {
    // Body
    ctx.fillStyle = '#059669';
    ctx.fillRect(3, 4, 12, 9);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(2, 5, 14, 7);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(4, 2, 10, 4);
    // Anime eyes
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(5, 6, 2, 3);
    ctx.fillRect(11, 6, 2, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 6, 1, 1);
    ctx.fillRect(12, 6, 1, 1);
    // Cute blush
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(4, 9, 2, 1);
    ctx.fillRect(12, 9, 2, 1);
  });
  createPixelTexture('slime_1', 18, 14, (ctx) => {
    // Squished/stretched hop frame
    ctx.fillStyle = '#059669';
    ctx.fillRect(2, 6, 14, 8);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(1, 7, 16, 6);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(3, 4, 12, 4);
    // Eyes
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(4, 8, 3, 2);
    ctx.fillRect(11, 8, 3, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 8, 1, 1);
    ctx.fillRect(12, 8, 1, 1);
  });

  // 5.2 Void Imp / Bat (20x16)
  createPixelTexture('bat_0', 20, 16, (ctx) => {
    // Wings up
    ctx.fillStyle = '#581c87';
    ctx.fillRect(0, 1, 6, 6);
    ctx.fillRect(14, 1, 6, 6);
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(1, 2, 4, 4);
    ctx.fillRect(15, 2, 4, 4);
    // Body
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(7, 5, 6, 8);
    // Glowing red eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 7, 1, 2);
    ctx.fillRect(11, 7, 1, 2);
    // Ears/horns
    ctx.fillStyle = '#581c87';
    ctx.fillRect(7, 3, 2, 2);
    ctx.fillRect(11, 3, 2, 2);
  });
  createPixelTexture('bat_1', 20, 16, (ctx) => {
    // Wings down
    ctx.fillStyle = '#581c87';
    ctx.fillRect(0, 8, 6, 6);
    ctx.fillRect(14, 8, 6, 6);
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(1, 9, 4, 4);
    ctx.fillRect(15, 9, 4, 4);
    // Body
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(7, 6, 6, 8);
    // Eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 8, 1, 2);
    ctx.fillRect(11, 8, 1, 2);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(7, 4, 2, 2);
    ctx.fillRect(11, 4, 2, 2);
  });

  // 5.3 Armored Skeleton / Dark Guard (22x28)
  createPixelTexture('skeleton_0', 22, 28, (ctx) => {
    // Legs
    ctx.fillStyle = '#64748b';
    ctx.fillRect(7, 20, 2, 8);
    ctx.fillRect(13, 20, 2, 8);
    // Bone ribcage / armor
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(6, 10, 10, 10);
    ctx.fillStyle = '#334155';
    ctx.fillRect(7, 12, 8, 7);
    // Skull
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(7, 3, 8, 7);
    ctx.fillStyle = '#0f172a'; // Eye sockets
    ctx.fillRect(8, 6, 2, 2);
    ctx.fillRect(12, 6, 2, 2);
    ctx.fillStyle = '#ef4444'; // Glowing red pupil
    ctx.fillRect(9, 7, 1, 1);
    ctx.fillRect(13, 7, 1, 1);
    // Shield
    ctx.fillStyle = '#475569';
    ctx.fillRect(1, 11, 4, 10);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(2, 12, 2, 8);
    // Spear / Bone blade
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(17, 4, 2, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(16, 2, 4, 3);
  });
  createPixelTexture('skeleton_1', 22, 28, (ctx) => {
    // Legs offset
    ctx.fillStyle = '#64748b';
    ctx.fillRect(6, 20, 3, 8);
    ctx.fillRect(14, 20, 3, 8);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(6, 11, 10, 10);
    ctx.fillStyle = '#334155';
    ctx.fillRect(7, 13, 8, 7);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(7, 4, 8, 7);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, 7, 2, 2);
    ctx.fillRect(12, 7, 2, 2);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(9, 8, 1, 1);
    ctx.fillRect(13, 8, 1, 1);
    ctx.fillStyle = '#475569';
    ctx.fillRect(1, 12, 4, 10);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(2, 13, 2, 8);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(17, 3, 2, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(16, 1, 4, 3);
  });

  // 5.4 BOSS: "MALACOR" (Shadow Warlock Archon) (40x48)
  createPixelTexture('boss_malacor_0', 40, 48, (ctx) => {
    // Dark floating aura
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(6, 12, 28, 32);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(8, 14, 24, 28);
    // Obsidian Spiked Robe & Shoulders
    ctx.fillStyle = '#09090b';
    ctx.fillRect(10, 18, 20, 26);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(12, 22, 16, 18);
    // Spiked obsidian crown
    ctx.fillStyle = '#18181b';
    ctx.fillRect(11, 4, 18, 6);
    ctx.fillRect(8, 1, 4, 8); // Horn 1
    ctx.fillRect(28, 1, 4, 8); // Horn 2
    ctx.fillRect(18, 0, 4, 6); // Crown gem horn
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(19, 2, 2, 2);
    // Face & Evil Red Eyes
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(13, 9, 14, 9);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(15, 12, 3, 3);
    ctx.fillRect(22, 12, 3, 3);
    ctx.fillStyle = '#ef4444'; // Glowing sinister eyes
    ctx.fillRect(16, 13, 2, 2);
    ctx.fillRect(23, 13, 2, 2);
    // Sinister smirk
    ctx.fillStyle = '#09090b';
    ctx.fillRect(17, 16, 6, 1);
    // Floating purple magic orbs in hands
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(3, 26, 6, 6);
    ctx.fillRect(31, 26, 6, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(4, 27, 4, 4);
    ctx.fillRect(32, 27, 4, 4);
  });
  createPixelTexture('boss_malacor_1', 40, 48, (ctx) => {
    // Floating hover bob frame
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(5, 10, 30, 34);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(7, 12, 26, 30);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(9, 16, 22, 28);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(11, 20, 18, 20);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(11, 2, 18, 6);
    ctx.fillRect(7, 0, 4, 8);
    ctx.fillRect(29, 0, 4, 8);
    ctx.fillRect(18, 0, 4, 5);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(19, 1, 2, 2);
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(13, 7, 14, 9);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(15, 10, 3, 3);
    ctx.fillRect(22, 10, 3, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(16, 11, 2, 2);
    ctx.fillRect(23, 11, 2, 2);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(17, 14, 6, 1);
    // Raised glowing hands
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(2, 20, 8, 8);
    ctx.fillRect(30, 20, 8, 8);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(4, 22, 4, 4);
    ctx.fillRect(32, 22, 4, 4);
  });

  // Create sprite animations
  const anims = scene.anims;
  if (!anims.exists('player_idle')) {
    anims.create({
      key: 'player_idle',
      frames: [{ key: 'player_idle_0' }, { key: 'player_idle_1' }],
      frameRate: 3,
      repeat: -1,
    });
  }
  if (!anims.exists('player_run')) {
    anims.create({
      key: 'player_run',
      frames: [
        { key: 'player_run_0' },
        { key: 'player_run_1' },
        { key: 'player_run_2' },
        { key: 'player_run_3' },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }
  if (!anims.exists('slime_walk')) {
    anims.create({
      key: 'slime_walk',
      frames: [{ key: 'slime_0' }, { key: 'slime_1' }],
      frameRate: 4,
      repeat: -1,
    });
  }
  if (!anims.exists('bat_fly')) {
    anims.create({
      key: 'bat_fly',
      frames: [{ key: 'bat_0' }, { key: 'bat_1' }],
      frameRate: 6,
      repeat: -1,
    });
  }
  if (!anims.exists('skeleton_walk')) {
    anims.create({
      key: 'skeleton_walk',
      frames: [{ key: 'skeleton_0' }, { key: 'skeleton_1' }],
      frameRate: 4,
      repeat: -1,
    });
  }
  if (!anims.exists('boss_hover')) {
    anims.create({
      key: 'boss_hover',
      frames: [{ key: 'boss_malacor_0' }, { key: 'boss_malacor_1' }],
      frameRate: 3,
      repeat: -1,
    });
  }
}
