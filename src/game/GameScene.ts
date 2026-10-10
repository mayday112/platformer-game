/**
 * Core Phaser Game Scene for Aetheria: Crystal Legend
 */

import Phaser from 'phaser';
import { generateGameTextures } from './textures';
import { LEVELS, LevelData } from './levels';
import { sound } from './audio';
import { gameEvents, virtualGamepad } from './events';

function setNoGravity(obj: Phaser.GameObjects.GameObject) {
  const body = (obj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body | null;
  if (body && 'setAllowGravity' in body) {
    body.setAllowGravity(false);
  }
}

function safeDestroy(obj: Phaser.GameObjects.GameObject | null | undefined) {
  if (obj && obj.active && (obj as any).scene) {
    obj.destroy();
  }
}

export class GameScene extends Phaser.Scene {
  private levelIndex: number = 0;
  private currentLevel!: LevelData;

  // Player state
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerHp: number = 5;
  private maxHp: number = 5;
  private mana: number = 100;
  private maxMana: number = 100;
  private score: number = 0;
  private crystalsCollected: number = 0;
  private hasKey: boolean = false;
  private isInvulnerable: boolean = false;
  private canDoubleJump: boolean = false;
  private isDashing: boolean = false;
  private canDash: boolean = true;
  private isAttacking: boolean = false;
  private facingRight: boolean = true;
  private respawnPoint: { x: number; y: number } = { x: 100, y: 400 };

  // Groups
  private platformsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatformsGroup!: Phaser.Physics.Arcade.Group;
  private crumblingPlatformsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private spikesGroup!: Phaser.Physics.Arcade.StaticGroup;
  private springsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private crystalsGroup!: Phaser.Physics.Arcade.Group;
  private potionsGroup!: Phaser.Physics.Arcade.Group;
  private keySprite: Phaser.Physics.Arcade.Sprite | null = null;
  private gateSprite!: Phaser.Physics.Arcade.Sprite;
  private checkpointSprite: Phaser.Physics.Arcade.Sprite | null = null;
  private checkpointActivated: boolean = false;

  // Combat Groups
  private playerProjectiles!: Phaser.Physics.Arcade.Group;
  private enemyProjectiles!: Phaser.Physics.Arcade.Group;
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private attackHitbox: Phaser.GameObjects.Rectangle | null = null;

  // Boss
  private bossSprite: Phaser.Physics.Arcade.Sprite | null = null;
  private bossHp: number = 0;
  private bossMaxHp: number = 0;
  private bossAttackTimer: number = 0;
  private bossTeleportTimer: number = 0;
  private bossHoverTween: Phaser.Tweens.Tween | null = null;
  private isBossInvulnerable: boolean = false;

  // Controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyJ!: Phaser.Input.Keyboard.Key;
  private keyK!: Phaser.Input.Keyboard.Key;
  private keyL!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyX!: Phaser.Input.Keyboard.Key;
  private keyC!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;

  // Parallax elements
  private bgStars: Phaser.GameObjects.TileSprite | null = null;
  private bgMountains: Phaser.GameObjects.TileSprite | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { levelIndex?: number; score?: number; crystals?: number }) {
    this.levelIndex = data.levelIndex ?? 0;
    this.score = data.score ?? 0;
    this.crystalsCollected = data.crystals ?? 0;
    this.currentLevel = LEVELS[this.levelIndex] || LEVELS[0];
    this.playerHp = 5;
    this.mana = 100;
    this.hasKey = false;
    this.checkpointActivated = false;
    this.respawnPoint = { ...this.currentLevel.playerStart };
    this.isInvulnerable = false;
    this.canDoubleJump = false;
    this.isDashing = false;
    this.canDash = true;
    this.isAttacking = false;
    this.facingRight = true;
    this.bossSprite = null;
    this.bossHp = 0;
    this.bossMaxHp = 0;
    this.bossHoverTween = null;
    this.isBossInvulnerable = false;
    this.keySprite = null;
    this.checkpointSprite = null;
  }

  preload() {
    // Generate all procedural pixel textures
    generateGameTextures(this);
  }

  create() {
    // 1. World Bounds
    this.physics.world.setBounds(0, 0, this.currentLevel.width, this.currentLevel.height + 100);

    // 2. Parallax Background
    this.createBackground();

    // 3. Groups setup
    this.platformsGroup = this.physics.add.staticGroup();
    this.movingPlatformsGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    this.crumblingPlatformsGroup = this.physics.add.staticGroup();
    this.spikesGroup = this.physics.add.staticGroup();
    this.springsGroup = this.physics.add.staticGroup();
    this.crystalsGroup = this.physics.add.group({ allowGravity: false });
    this.potionsGroup = this.physics.add.group({ allowGravity: false });
    this.enemiesGroup = this.physics.add.group();
    this.playerProjectiles = this.physics.add.group({ allowGravity: false });
    this.enemyProjectiles = this.physics.add.group({ allowGravity: false });

    // 4. Build Level Geography
    this.buildLevel();

    // 5. Spawn Player
    this.createPlayer();

    // 6. Setup Colliders & Overlaps
    this.setupCollisions();

    // 7. Setup Camera
    this.cameras.main.setBounds(0, 0, this.currentLevel.width, this.currentLevel.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    // 8. Keyboard input setup
    this.setupKeyboard();

    // 9. Sound & Music
    sound.playBGM(this.currentLevel.theme);

    // 10. Emit Initial Status to React
    this.broadcastStatus();
    gameEvents.emit({
      type: 'LEVEL_START',
      payload: { levelId: this.currentLevel.id, name: this.currentLevel.name },
    });

    // 11. Trigger Dialogue if available
    if (this.currentLevel.dialogue && this.currentLevel.dialogue.length > 0) {
      this.currentLevel.dialogue.forEach((d, idx) => {
        this.time.delayedCall(idx * 3000 + 500, () => {
          gameEvents.emit({
            type: 'DIALOGUE',
            payload: d,
          });
        });
      });
    }
  }

  private createBackground() {
    const width = this.currentLevel.width;
    const height = this.currentLevel.height;

    // Atmospheric gradient sky
    const skyG = this.add.graphics();
    if (this.currentLevel.theme === 'forest') {
      skyG.fillGradientStyle(0x0a1128, 0x1c1954, 0x1e3a8a, 0x064e3b, 1);
    } else if (this.currentLevel.theme === 'cavern') {
      skyG.fillGradientStyle(0x050515, 0x0d1117, 0x1e1b4b, 0x312e81, 1);
    } else {
      skyG.fillGradientStyle(0x020617, 0x2e1065, 0x4c1d95, 0x0f172a, 1);
    }
    skyG.fillRect(0, 0, width, height);
    skyG.setScrollFactor(0);

    // Distant Stars / Floating Motes
    const starG = this.add.graphics();
    for (let i = 0; i < 90; i++) {
      const sx = Phaser.Math.Between(0, width);
      const sy = Phaser.Math.Between(0, height - 120);
      const alpha = Phaser.Math.FloatBetween(0.3, 0.9);
      const size = Phaser.Math.Between(1, 2);
      starG.fillStyle(0xc7d2fe, alpha);
      starG.fillRect(sx, sy, size, size);
    }
    starG.setScrollFactor(0.2);

    // Distant mountain / ruins silhouette
    const mountG = this.add.graphics();
    mountG.fillStyle(0x0f172a, 0.7);
    for (let mx = 0; mx < width; mx += 160) {
      const mh = Phaser.Math.Between(140, 240);
      mountG.fillTriangle(mx, height, mx + 80, height - mh, mx + 160, height);
    }
    mountG.setScrollFactor(0.4);
  }

  private buildLevel() {
    // 1. Static Platforms
    this.currentLevel.platforms.forEach((plat) => {
      const tileKey = plat.type === 'crystal' ? 'tile_crystal' : plat.type === 'stone' ? 'tile_stone' : 'tile_grass';
      const numTilesX = Math.ceil(plat.w / 16);
      const numTilesY = Math.ceil(plat.h / 16);

      for (let tx = 0; tx < numTilesX; tx++) {
        for (let ty = 0; ty < numTilesY; ty++) {
          const px = plat.x + tx * 16 + 8;
          const py = plat.y + ty * 16 + 8;
          const tile = this.platformsGroup.create(px, py, tileKey);
          tile.refreshBody();
        }
      }
    });

    // 2. Moving Platforms
    if (this.currentLevel.movingPlatforms) {
      this.currentLevel.movingPlatforms.forEach((mp) => {
        const plat = this.movingPlatformsGroup.create(mp.x, mp.y, 'moving_platform') as Phaser.Physics.Arcade.Sprite;
        plat.setImmovable(true);
        setNoGravity(plat);
        plat.setData('startX', mp.x);
        plat.setData('startY', mp.y);
        plat.setData('targetX', mp.x + mp.dx);
        plat.setData('targetY', mp.y + mp.dy);
        plat.setData('speed', mp.speed);
        plat.setData('movingForward', true);
      });
    }

    // 3. Crumbling Platforms
    if (this.currentLevel.crumblingPlatforms) {
      this.currentLevel.crumblingPlatforms.forEach((cp) => {
        const slab = this.crumblingPlatformsGroup.create(cp.x, cp.y, 'crumbling_platform') as Phaser.Physics.Arcade.Sprite;
        slab.refreshBody();
        slab.setData('originalX', cp.x);
        slab.setData('originalY', cp.y);
        slab.setData('isCrumbling', false);
      });
    }

    // 4. Spikes
    this.currentLevel.spikes.forEach((sp) => {
      const count = sp.count || 1;
      for (let i = 0; i < count; i++) {
        const spike = this.spikesGroup.create(sp.x + i * 16, sp.y, 'tile_spikes');
        spike.refreshBody();
      }
    });

    // 5. Spring Pads
    this.currentLevel.springs.forEach((spr) => {
      const pad = this.springsGroup.create(spr.x, spr.y, 'spring_pad');
      pad.refreshBody();
    });

    // 6. Mana Crystals
    this.currentLevel.crystals.forEach((c) => {
      const crystal = this.crystalsGroup.create(c.x, c.y, 'crystal_item') as Phaser.Physics.Arcade.Sprite;
      setNoGravity(crystal);
      this.tweens.add({
        targets: crystal,
        y: c.y - 6,
        duration: 900 + Phaser.Math.Between(0, 300),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // 7. Health Potions
    this.currentLevel.potions.forEach((p) => {
      const pot = this.potionsGroup.create(p.x, p.y, 'potion_item') as Phaser.Physics.Arcade.Sprite;
      setNoGravity(pot);
      this.tweens.add({
        targets: pot,
        y: p.y - 5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // 8. Key Item (if level requires key)
    if (this.currentLevel.hasKey && this.currentLevel.keyPos) {
      this.keySprite = this.physics.add.sprite(
        this.currentLevel.keyPos.x,
        this.currentLevel.keyPos.y,
        'key_item'
      );
      setNoGravity(this.keySprite);
      this.tweens.add({
        targets: this.keySprite,
        y: this.currentLevel.keyPos.y - 8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // 9. Checkpoint
    if (this.currentLevel.checkpoint) {
      this.checkpointSprite = this.physics.add.sprite(
        this.currentLevel.checkpoint.x,
        this.currentLevel.checkpoint.y,
        'checkpoint_off'
      );
      setNoGravity(this.checkpointSprite);
      this.checkpointSprite.setImmovable(true);
    }

    // 10. Exit Gate
    const gateKey = this.currentLevel.hasKey || this.currentLevel.boss ? 'gate_locked' : 'gate_open';
    this.gateSprite = this.physics.add.sprite(
      this.currentLevel.goal.x,
      this.currentLevel.goal.y,
      gateKey
    );
    setNoGravity(this.gateSprite);
    this.gateSprite.setImmovable(true);

    // 11. Spawn Regular Enemies
    this.currentLevel.enemies.forEach((e) => {
      this.spawnEnemy(e.x, e.y, e.type, e.patrolDist || 60);
    });

    // 12. Spawn Boss (if boss level)
    if (this.currentLevel.boss) {
      this.spawnBoss(this.currentLevel.boss.x, this.currentLevel.boss.y, this.currentLevel.boss.hp);
    }
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(
      this.currentLevel.playerStart.x,
      this.currentLevel.playerStart.y,
      'player_idle_0'
    );
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(850);
    this.player.setSize(16, 26);
    this.player.setOffset(4, 4);
    this.player.setDepth(30);
    this.player.setAlpha(1);
    this.player.setVisible(true);
    this.player.play('player_idle');
  }

  private setupKeyboard() {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Attack keys
    const triggerAttack = () => this.handleMeleeAttack();
    this.keyJ.on('down', triggerAttack);
    this.keyX.on('down', triggerAttack);

    // Magic keys
    const triggerMagic = () => this.handleMagicCast();
    this.keyK.on('down', triggerMagic);
    this.keyC.on('down', triggerMagic);

    // Dash keys
    const triggerDash = () => this.handleDash();
    this.keyShift.on('down', triggerDash);
    this.keyE.on('down', triggerDash);
  }

  private setupCollisions() {
    // Player on static & moving & crumbling platforms
    this.physics.add.collider(this.player, this.platformsGroup, () => {
      this.canDoubleJump = true;
    });

    this.physics.add.collider(this.player, this.movingPlatformsGroup, () => {
      this.canDoubleJump = true;
    });

    this.physics.add.collider(this.player, this.crumblingPlatformsGroup, (pObj, cObj) => {
      this.canDoubleJump = true;
      this.handleCrumblePlatform(cObj as Phaser.Physics.Arcade.Sprite);
    });

    // Enemies on platforms
    this.physics.add.collider(this.enemiesGroup, this.platformsGroup);

    // Spring pad bounce
    this.physics.add.overlap(this.player, this.springsGroup, (pObj, sprObj) => {
      this.handleSpringBounce(sprObj as Phaser.Physics.Arcade.Sprite);
    });

    // Spikes hazard
    this.physics.add.overlap(this.player, this.spikesGroup, () => {
      this.handlePlayerDamage(1, 'Terkena Duri');
    });

    // Crystal collection
    this.physics.add.overlap(this.player, this.crystalsGroup, (pObj, cObj) => {
      this.handleCollectCrystal(cObj as Phaser.Physics.Arcade.Sprite);
    });

    // Potion collection
    this.physics.add.overlap(this.player, this.potionsGroup, (pObj, potObj) => {
      this.handleCollectPotion(potObj as Phaser.Physics.Arcade.Sprite);
    });

    // Key collection
    if (this.keySprite) {
      this.physics.add.overlap(this.player, this.keySprite, () => {
        this.handleCollectKey();
      });
    }

    // Checkpoint overlap
    if (this.checkpointSprite) {
      this.physics.add.overlap(this.player, this.checkpointSprite, () => {
        this.handleCheckpointActivate();
      });
    }

    // Exit Gate overlap
    this.physics.add.overlap(this.player, this.gateSprite, () => {
      this.handleGateReach();
    });

    // Player touch Enemy
    this.physics.add.overlap(this.player, this.enemiesGroup, (pObj, enemyObj) => {
      const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
      // Stomp check: if player is falling and above enemy
      if (this.player.body!.velocity.y > 50 && this.player.y < enemy.y - 10) {
        this.defeatEnemy(enemy);
        this.player.setVelocityY(-280);
        sound.playEnemyHurt();
      } else {
        this.handlePlayerDamage(1, 'Serangan Monster');
      }
    });

    // Player Projectiles hitting Enemies
    this.physics.add.overlap(this.playerProjectiles, this.enemiesGroup, (objA, objB) => {
      const proj = this.playerProjectiles.contains(objA as any)
        ? (objA as Phaser.Physics.Arcade.Sprite)
        : (objB as Phaser.Physics.Arcade.Sprite);
      const enemy = this.enemiesGroup.contains(objB as any)
        ? (objB as Phaser.Physics.Arcade.Sprite)
        : (objA as Phaser.Physics.Arcade.Sprite);

      safeDestroy(proj);
      if (enemy && enemy.active && enemy.scene) {
        this.defeatEnemy(enemy);
      }
    });

    // Player Projectiles hitting Boss
    if (this.bossSprite) {
      this.physics.add.overlap(this.playerProjectiles, this.bossSprite, (objA, objB) => {
        // Crucial: Determine which object is the projectile and which is the boss
        const proj = this.playerProjectiles.contains(objA as any)
          ? (objA as Phaser.Physics.Arcade.Sprite)
          : (objB as Phaser.Physics.Arcade.Sprite);

        safeDestroy(proj);
        this.damageBoss(1);
      });

      // Player contact damage with Boss
      this.physics.add.overlap(this.player, this.bossSprite, () => {
        this.handlePlayerDamage(1, 'Sentuhan Aura Malacor');
      });
    }

    // Player Projectiles hitting Walls
    this.physics.add.collider(this.playerProjectiles, this.platformsGroup, (objA, objB) => {
      const proj = this.playerProjectiles.contains(objA as any)
        ? (objA as Phaser.Physics.Arcade.Sprite)
        : (objB as Phaser.Physics.Arcade.Sprite);

      if (proj && proj.active && proj.scene) {
        this.createSparkles(proj.x, proj.y, 0x38bdf8);
        safeDestroy(proj);
      }
    });

    // Enemy Projectiles hitting Player
    this.physics.add.overlap(this.enemyProjectiles, this.player, (objA, objB) => {
      // Crucial: objA may be player and objB projectile or vice-versa
      const proj = this.enemyProjectiles.contains(objA as any)
        ? (objA as Phaser.Physics.Arcade.Sprite)
        : (objB as Phaser.Physics.Arcade.Sprite);

      safeDestroy(proj);
      this.handlePlayerDamage(1, 'Sihir Bayangan');
    });

    // Enemy Projectiles hitting Walls
    this.physics.add.collider(this.enemyProjectiles, this.platformsGroup, (objA, objB) => {
      const proj = this.enemyProjectiles.contains(objA as any)
        ? (objA as Phaser.Physics.Arcade.Sprite)
        : (objB as Phaser.Physics.Arcade.Sprite);

      safeDestroy(proj);
    });
  }

  // --- ENTITY FACTORIES ---

  private spawnEnemy(x: number, y: number, type: 'slime' | 'bat' | 'skeleton', patrolDist: number) {
    let enemyKey = 'slime_0';
    if (type === 'bat') enemyKey = 'bat_0';
    if (type === 'skeleton') enemyKey = 'skeleton_0';

    const enemy = this.enemiesGroup.create(x, y, enemyKey) as Phaser.Physics.Arcade.Sprite;
    enemy.setData('type', type);
    enemy.setData('startX', x);
    enemy.setData('patrolDist', patrolDist);
    enemy.setData('dir', 1);

    if (type === 'slime') {
      enemy.setGravityY(700);
      enemy.setVelocityX(40);
      enemy.play('slime_walk');
      enemy.setSize(16, 12);
    } else if (type === 'bat') {
      setNoGravity(enemy);
      enemy.setVelocityX(50);
      enemy.play('bat_fly');
      enemy.setSize(18, 14);
      enemy.setData('baseY', y);
    } else if (type === 'skeleton') {
      enemy.setGravityY(700);
      enemy.setVelocityX(35);
      enemy.play('skeleton_walk');
      enemy.setSize(18, 26);
    }
  }

  private spawnBoss(x: number, y: number, hp: number) {
    this.bossMaxHp = hp;
    this.bossHp = hp;
    this.isBossInvulnerable = false;
    this.bossSprite = this.physics.add.sprite(x, y, 'boss_malacor_0');
    setNoGravity(this.bossSprite);
    this.bossSprite.setSize(32, 44);
    this.bossSprite.setDepth(25);
    this.bossSprite.setAlpha(1);
    this.bossSprite.setVisible(true);
    this.bossSprite.play('boss_hover');

    // Idle hover bob tween
    this.bossHoverTween = this.tweens.add({
      targets: this.bossSprite,
      y: y - 14,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.broadcastStatus();
  }

  // --- ACTIONS & COMBAT ---

  public handleMeleeAttack() {
    if (this.isAttacking) return;
    this.isAttacking = true;
    sound.playSlash();

    this.player.setTexture('player_slash');
    this.player.setDepth(30);
    this.player.setAlpha(1);
    this.player.setVisible(true);

    // Spawn slash crescent FX
    const slashOffset = this.facingRight ? 24 : -24;
    const slash = this.add.sprite(this.player.x + slashOffset, this.player.y, 'slash_fx');
    slash.setFlipX(!this.facingRight);
    slash.setDepth(32);

    // Attack Hitbox check
    const hitBox = new Phaser.Geom.Rectangle(
      this.facingRight ? this.player.x + 8 : this.player.x - 32,
      this.player.y - 16,
      24,
      32
    );

    // Hit regular enemies
    this.enemiesGroup.getChildren().forEach((eObj) => {
      const e = eObj as Phaser.Physics.Arcade.Sprite;
      if (Phaser.Geom.Rectangle.Overlaps(hitBox, e.getBounds())) {
        this.defeatEnemy(e);
      }
    });

    // Hit Boss
    if (this.bossSprite && !this.isBossInvulnerable && Phaser.Geom.Rectangle.Overlaps(hitBox, this.bossSprite.getBounds())) {
      this.damageBoss(1);
    }

    // Animation settle
    this.time.delayedCall(200, () => {
      safeDestroy(slash);
      this.isAttacking = false;
      if (this.player && this.player.active) {
        this.player.setAlpha(1);
        this.player.setVisible(true);
        this.player.setDepth(30);
        this.player.play('player_idle', true);
      }
    });
  }

  public handleMagicCast() {
    if (this.mana < 20) {
      this.showFloatingText(this.player.x, this.player.y - 20, 'Mana Habis!', '#ef4444');
      return;
    }

    this.mana -= 20;
    this.broadcastStatus();
    sound.playMagic();

    const spawnX = this.facingRight ? this.player.x + 18 : this.player.x - 18;
    const bullet = this.playerProjectiles.create(spawnX, this.player.y, 'bullet_magic') as Phaser.Physics.Arcade.Sprite;
    bullet.setVelocityX(this.facingRight ? 380 : -380);
    setNoGravity(bullet);

    // Auto destroy after 1.5s
    this.time.delayedCall(1500, () => {
      safeDestroy(bullet);
    });
  }

  public handleDash() {
    if (!this.player || !this.player.active || !this.player.body) return;
    if (!this.canDash || this.isDashing) return;
    this.isDashing = true;
    this.canDash = false;
    sound.playDash();

    this.player.setTexture('player_dash');
    const dashVelocity = this.facingRight ? 460 : -460;
    this.player.setVelocityX(dashVelocity);
    this.player.setVelocityY(0);

    // Create ghost trail
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 45, () => {
        if (!this.player.active) return;
        const ghost = this.add.sprite(this.player.x, this.player.y, 'player_dash');
        ghost.setFlipX(!this.facingRight);
        ghost.setAlpha(0.5);
        this.tweens.add({
          targets: ghost,
          alpha: 0,
          duration: 200,
          onComplete: () => safeDestroy(ghost),
        });
      });
    }

    // End dash
    this.time.delayedCall(180, () => {
      this.isDashing = false;
      if (this.player.active) {
        this.player.setAlpha(1);
        this.player.setVisible(true);
        this.player.play('player_idle', true);
      }
    });

    // Cooldown
    this.time.delayedCall(700, () => {
      this.canDash = true;
    });
  }

  private defeatEnemy(enemy: Phaser.Physics.Arcade.Sprite) {
    if (!enemy || !enemy.active || !(enemy as any).scene) return;
    sound.playEnemyHurt();
    this.score += 50;
    this.createSparkles(enemy.x, enemy.y, 0x10b981);
    this.showFloatingText(enemy.x, enemy.y - 10, '+50', '#34d399');
    safeDestroy(enemy);
    this.broadcastStatus();
  }

  private damageBoss(dmg: number) {
    if (!this.bossSprite || this.bossHp <= 0 || this.isBossInvulnerable) return;
    this.isBossInvulnerable = true;
    this.bossHp -= dmg;
    sound.playBossHurt();
    this.broadcastStatus();

    // Damage visual feedback: Alpha hurt flicker (100% stable, zero shader tint division-by-zero artifacts)
    this.bossSprite.setAlpha(0.25);
    this.time.delayedCall(120, () => {
      if (this.bossSprite && this.bossSprite.active) {
        this.bossSprite.setAlpha(1);
        this.bossSprite.setVisible(true);
      }
    });

    this.cameras.main.shake(120, 0.008);
    this.createSparkles(this.bossSprite.x, this.bossSprite.y, 'purple', 14);
    this.showFloatingText(this.bossSprite.x, this.bossSprite.y - 20, '-1 HP', '#ef4444');

    // Reset boss invulnerability window after 450ms
    this.time.delayedCall(450, () => {
      this.isBossInvulnerable = false;
    });

    // Boss Defeated
    if (this.bossHp <= 0) {
      sound.playVictory();
      this.score += 500;
      this.broadcastStatus();

      if (this.bossHoverTween) {
        this.bossHoverTween.stop();
        this.tweens.remove(this.bossHoverTween);
        this.bossHoverTween = null;
      }
      this.tweens.killTweensOf(this.bossSprite);

      this.createSparkles(this.bossSprite.x, this.bossSprite.y, 'gold', 30);
      this.tweens.add({
        targets: this.bossSprite,
        alpha: 0,
        y: this.bossSprite.y - 40,
        duration: 1000,
        onComplete: () => {
          safeDestroy(this.bossSprite);
          // Unlock victory gate
          this.gateSprite.setTexture('gate_open');
          this.showFloatingText(this.gateSprite.x, this.gateSprite.y - 30, 'Gerbang Terbuka!', '#38bdf8');
          gameEvents.emit({
            type: 'DIALOGUE',
            payload: {
              speaker: 'Lyra',
              text: 'Malacor telah dikalahkan! Inti kristal Aetheria kembali bersinar!',
              avatar: 'hero',
            },
          });
        },
      });
    } else {
      // Teleport boss to different open aerial position
      this.teleportBoss();
    }
  }

  private teleportBoss() {
    if (!this.bossSprite || !this.bossSprite.active) return;

    // Aerial combat hovering coordinates within the arena in open air
    const targetSpots = [
      { x: 860, y: 310 },
      { x: 1150, y: 240 },
      { x: 1430, y: 310 },
      { x: 1000, y: 380 },
      { x: 1300, y: 380 },
    ];

    // Pick a spot different from current spot
    const currentX = this.bossSprite.x;
    const candidates = targetSpots.filter((s) => Math.abs(s.x - currentX) > 80);
    const spot = candidates.length > 0 ? Phaser.Utils.Array.GetRandom(candidates) : Phaser.Utils.Array.GetRandom(targetSpots);

    // Stop previous hover tween so it does not drag boss back to old Y
    if (this.bossHoverTween) {
      this.bossHoverTween.stop();
      this.tweens.remove(this.bossHoverTween);
      this.bossHoverTween = null;
    }
    this.tweens.killTweensOf(this.bossSprite);

    // Departure sparkles
    this.createSparkles(this.bossSprite.x, this.bossSprite.y, 'purple', 14);

    // Relocate boss
    this.bossSprite.setPosition(spot.x, spot.y);
    if (this.bossSprite.body) {
      this.bossSprite.body.reset(spot.x, spot.y);
      setNoGravity(this.bossSprite);
      this.bossSprite.setVelocity(0, 0);
    }
    this.bossSprite.setDepth(25);
    this.bossSprite.setAlpha(1);
    this.bossSprite.setVisible(true);

    // Ensure boss animation is running
    this.bossSprite.play('boss_hover', true);

    // Arrival sparkles
    this.createSparkles(spot.x, spot.y, 'purple', 14);

    // Start fresh hover bob at new position
    this.bossHoverTween = this.tweens.add({
      targets: this.bossSprite,
      y: spot.y - 12,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private bossCastSpell() {
    if (!this.bossSprite || !this.bossSprite.active || this.bossHp <= 0) return;
    // Cast shadow bullet targeting player
    const orb = this.enemyProjectiles.create(this.bossSprite.x, this.bossSprite.y, 'bullet_enemy') as Phaser.Physics.Arcade.Sprite;
    setNoGravity(orb);
    orb.setDepth(28);
    this.physics.moveToObject(orb, this.player, 180);

    this.time.delayedCall(2500, () => {
      safeDestroy(orb);
    });
  }

  private handlePlayerDamage(amount: number, reason: string) {
    if (!this.player || !this.player.active || !this.player.body || !(this.player as any).scene) return;
    if (this.isInvulnerable || this.isDashing) return;

    this.playerHp -= amount;
    this.isInvulnerable = true;
    sound.playHurt();
    this.broadcastStatus();

    this.cameras.main.shake(120, 0.008);

    // Directional knockback away from danger source
    const knockDir = this.bossSprite && this.player.x < this.bossSprite.x ? -170 : 170;
    this.player.setVelocity(knockDir, -220);

    // Reset alpha and ensure visibility without WebGL tint shader errors
    this.tweens.killTweensOf(this.player);
    this.player.setAlpha(1);
    this.player.setVisible(true);
    this.player.setDepth(30);

    if (this.playerHp <= 0) {
      this.handleGameOver(reason);
      return;
    }

    // Invulnerability blinking
    this.tweens.add({
      targets: this.player,
      alpha: 0.35,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        if (this.player && this.player.active && (this.player as any).scene) {
          this.player.setAlpha(1);
          this.player.setVisible(true);
          this.player.setDepth(30);
          this.isInvulnerable = false;
        }
      },
    });
  }

  private handleGameOver(reason: string) {
    sound.playGameOver();
    this.player.disableBody(true, true);
    gameEvents.emit({
      type: 'GAME_OVER',
      payload: { levelId: this.currentLevel.id, reason },
    });
  }

  private handleSpringBounce(spring: Phaser.Physics.Arcade.Sprite) {
    if (!this.player || !this.player.active || !this.player.body) return;
    sound.playSpring();
    this.player.setVelocityY(-560);
    this.canDoubleJump = true;

    // Compress spring animation
    this.tweens.add({
      targets: spring,
      scaleY: 0.5,
      y: spring.y + 4,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        spring.setScale(1);
      },
    });
  }

  private handleCrumblePlatform(slab: Phaser.Physics.Arcade.Sprite) {
    if (slab.getData('isCrumbling')) return;
    slab.setData('isCrumbling', true);

    // Shake
    this.tweens.add({
      targets: slab,
      x: slab.x + 3,
      duration: 40,
      yoyo: true,
      repeat: 8,
      onComplete: () => {
        // Fall and fade
        slab.disableBody(false, false);
        this.tweens.add({
          targets: slab,
          alpha: 0,
          y: slab.y + 20,
          duration: 300,
          onComplete: () => {
            // Respawn after 3.5s
            this.time.delayedCall(3500, () => {
              if (slab.active) {
                slab.setPosition(slab.getData('originalX'), slab.getData('originalY'));
                slab.setAlpha(1);
                slab.enableBody(true, slab.getData('originalX'), slab.getData('originalY'), true, true);
                slab.setData('isCrumbling', false);
              }
            });
          },
        });
      },
    });
  }

  private handleCollectCrystal(crystal: Phaser.Physics.Arcade.Sprite) {
    if (!crystal || !crystal.active || !(crystal as any).scene) return;
    sound.playCrystal();
    this.score += 25;
    this.crystalsCollected += 1;
    this.mana = Math.min(this.maxMana, this.mana + 15);
    this.createSparkles(crystal.x, crystal.y, 0x38bdf8);
    safeDestroy(crystal);
    this.broadcastStatus();
  }

  private handleCollectPotion(potion: Phaser.Physics.Arcade.Sprite) {
    if (!potion || !potion.active || !(potion as any).scene) return;
    sound.playHeal();
    this.playerHp = Math.min(this.maxHp, this.playerHp + 1);
    this.createSparkles(potion.x, potion.y, 0xf43f5e);
    this.showFloatingText(potion.x, potion.y - 10, '+1 HP', '#fda4af');
    safeDestroy(potion);
    this.broadcastStatus();
  }

  private handleCollectKey() {
    if (this.hasKey) return;
    this.hasKey = true;
    sound.playUnlock();
    this.showFloatingText(this.player.x, this.player.y - 20, 'Kunci Kristal Ditemukan!', '#f59e0b');
    if (this.keySprite) {
      this.createSparkles(this.keySprite.x, this.keySprite.y, 0xf59e0b);
      safeDestroy(this.keySprite);
    }
    // Unlock gate visually
    this.gateSprite.setTexture('gate_open');
    this.broadcastStatus();
  }

  private handleCheckpointActivate() {
    if (this.checkpointActivated || !this.checkpointSprite) return;
    this.checkpointActivated = true;
    sound.playCheckpoint();
    this.checkpointSprite.setTexture('checkpoint_on');
    this.respawnPoint = { x: this.checkpointSprite.x, y: this.checkpointSprite.y - 20 };
    this.showFloatingText(this.checkpointSprite.x, this.checkpointSprite.y - 30, 'Checkpoint Aktif!', '#38bdf8');
    this.createSparkles(this.checkpointSprite.x, this.checkpointSprite.y, 0x38bdf8);
  }

  private handleGateReach() {
    if (this.currentLevel.hasKey && !this.hasKey) {
      this.showFloatingText(this.gateSprite.x, this.gateSprite.y - 30, 'Perlu Kunci Kristal!', '#f87171');
      return;
    }
    if (this.currentLevel.boss && this.bossHp > 0) {
      this.showFloatingText(this.gateSprite.x, this.gateSprite.y - 30, 'Kalahkan Malacor!', '#f87171');
      return;
    }

    sound.playVictory();
    this.player.disableBody(true, true);

    const isLastLevel = this.levelIndex >= LEVELS.length - 1;
    if (isLastLevel) {
      gameEvents.emit({
        type: 'GAME_VICTORY',
        payload: {
          totalScore: this.score,
          totalCrystals: this.crystalsCollected,
        },
      });
    } else {
      gameEvents.emit({
        type: 'LEVEL_COMPLETE',
        payload: {
          levelId: this.currentLevel.id,
          levelIndex: this.levelIndex,
          score: this.score,
          crystals: this.crystalsCollected,
        },
      });
    }
  }

  // --- FLOATING TEXT & PARTICLES ---

  private showFloatingText(x: number, y: number, text: string, color: string) {
    const fText = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: color,
      stroke: '#030712',
      strokeThickness: 3,
    });
    fText.setOrigin(0.5);

    this.tweens.add({
      targets: fText,
      y: y - 24,
      alpha: 0,
      duration: 900,
      onComplete: () => fText.destroy(),
    });
  }

  private createSparkles(x: number, y: number, colorOrTint: number | string = 'cyan', count: number = 8) {
    let sparkleKey = 'particle_sparkle_cyan';
    if (typeof colorOrTint === 'string') {
      sparkleKey = `particle_sparkle_${colorOrTint}`;
    } else if (colorOrTint === 0xa855f7 || colorOrTint === 0x9333ea) {
      sparkleKey = 'particle_sparkle_purple';
    } else if (colorOrTint === 0x10b981 || colorOrTint === 0x059669) {
      sparkleKey = 'particle_sparkle_emerald';
    } else if (colorOrTint === 0xf59e0b || colorOrTint === 0xfbbf24) {
      sparkleKey = 'particle_sparkle_gold';
    } else if (colorOrTint === 0xef4444 || colorOrTint === 0xf43f5e) {
      sparkleKey = 'particle_sparkle_crimson';
    }

    // Fallback if texture not registered
    if (!this.textures.exists(sparkleKey)) {
      sparkleKey = 'particle_sparkle';
    }

    for (let i = 0; i < count; i++) {
      const sp = this.add.sprite(x, y, sparkleKey);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(30, 90);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.tweens.add({
        targets: sp,
        x: x + vx * 0.4,
        y: y + vy * 0.4,
        alpha: 0,
        scale: 0.3,
        duration: 350 + Phaser.Math.Between(0, 150),
        onComplete: () => sp.destroy(),
      });
    }
  }

  // --- BROADCAST STATUS TO REACT ---

  private broadcastStatus() {
    gameEvents.emit({
      type: 'STATUS_UPDATE',
      payload: {
        hp: this.playerHp,
        maxHp: this.maxHp,
        mana: Math.round(this.mana),
        maxMana: this.maxMana,
        score: this.score,
        crystals: this.crystalsCollected,
        hasKey: this.hasKey,
        levelId: this.currentLevel.id,
        levelName: this.currentLevel.name,
        isPaused: this.scene.isPaused(),
        bossHp: this.bossHp,
        bossMaxHp: this.bossMaxHp,
      },
    });
  }

  // --- UPDATE LOOP ---

  update(time: number, delta: number) {
    if (!this.player || !this.player.active || !this.player.body) return;

    // Passive mana regeneration
    if (this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + 0.08 * (delta / 16.6));
    }

    // Moving platforms physics update
    if (this.movingPlatformsGroup) {
      this.movingPlatformsGroup.getChildren().forEach((pObj) => {
        const plat = pObj as Phaser.Physics.Arcade.Sprite;
        if (!plat || !plat.active || !plat.body) return;
        const startX = plat.getData('startX');
        const startY = plat.getData('startY');
        const targetX = plat.getData('targetX');
        const targetY = plat.getData('targetY');
        const speed = plat.getData('speed');
        let movingForward = plat.getData('movingForward');

        if (startX !== targetX) {
          if (movingForward) {
            plat.setVelocityX(speed);
            if (plat.x >= Math.max(startX, targetX)) plat.setData('movingForward', false);
          } else {
            plat.setVelocityX(-speed);
            if (plat.x <= Math.min(startX, targetX)) plat.setData('movingForward', true);
          }
        }

        if (startY !== targetY) {
          if (movingForward) {
            plat.setVelocityY(speed);
            if (plat.y >= Math.max(startY, targetY)) plat.setData('movingForward', false);
          } else {
            plat.setVelocityY(-speed);
            if (plat.y <= Math.min(startY, targetY)) plat.setData('movingForward', true);
          }
        }
      });
    }

    // Enemy AI updates
    this.enemiesGroup.getChildren().forEach((eObj) => {
      const enemy = eObj as Phaser.Physics.Arcade.Sprite;
      const type = enemy.getData('type');
      const startX = enemy.getData('startX');
      const patrolDist = enemy.getData('patrolDist');
      const dir = enemy.getData('dir');

      if (type === 'slime' || type === 'skeleton') {
        if (enemy.x > startX + patrolDist) {
          enemy.setData('dir', -1);
          enemy.setVelocityX(type === 'slime' ? -40 : -35);
          enemy.setFlipX(false);
        } else if (enemy.x < startX - patrolDist) {
          enemy.setData('dir', 1);
          enemy.setVelocityX(type === 'slime' ? 40 : 35);
          enemy.setFlipX(true);
        }
      } else if (type === 'bat') {
        // Sinusoidal flight
        const baseY = enemy.getData('baseY');
        enemy.y = baseY + Math.sin(time / 200) * 12;

        if (enemy.x > startX + patrolDist) {
          enemy.setVelocityX(-50);
          enemy.setFlipX(false);
        } else if (enemy.x < startX - patrolDist) {
          enemy.setVelocityX(50);
          enemy.setFlipX(true);
        }
      }
    });

    // Boss AI updates
    if (this.bossSprite && this.bossHp > 0) {
      this.bossAttackTimer += delta;
      if (this.bossAttackTimer > 2800) {
        this.bossAttackTimer = 0;
        this.bossCastSpell();
      }
    }

    // Input combination: Keyboard + Virtual Gamepad
    const moveLeft =
      this.cursors?.left.isDown ||
      this.keyA?.isDown ||
      virtualGamepad.left;

    const moveRight =
      this.cursors?.right.isDown ||
      this.keyD?.isDown ||
      virtualGamepad.right;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace) ||
      virtualGamepad.jump;

    // Reset single virtual jump trigger
    if (virtualGamepad.jump) virtualGamepad.jump = false;
    if (virtualGamepad.attack) {
      virtualGamepad.attack = false;
      this.handleMeleeAttack();
    }
    if (virtualGamepad.magic) {
      virtualGamepad.magic = false;
      this.handleMagicCast();
    }
    if (virtualGamepad.dash) {
      virtualGamepad.dash = false;
      this.handleDash();
    }

    const onFloor = this.player.body!.blocked.down || this.player.body!.touching.down;

    // Handle horizontal movement if not dashing
    if (!this.isDashing) {
      const speed = 210;
      if (moveLeft) {
        this.player.setVelocityX(-speed);
        this.facingRight = false;
        this.player.setFlipX(true);
        if (onFloor && !this.isAttacking) this.player.play('player_run', true);
      } else if (moveRight) {
        this.player.setVelocityX(speed);
        this.facingRight = true;
        this.player.setFlipX(false);
        if (onFloor && !this.isAttacking) this.player.play('player_run', true);
      } else {
        this.player.setVelocityX(0);
        if (onFloor && !this.isAttacking) this.player.play('player_idle', true);
      }
    }

    // Handle jumping
    if (jumpPressed) {
      if (onFloor) {
        this.player.setVelocityY(-390);
        this.canDoubleJump = true;
        sound.playJump();
        if (!this.isAttacking) this.player.setTexture('player_jump');
      } else if (this.canDoubleJump) {
        this.player.setVelocityY(-360);
        this.canDoubleJump = false;
        sound.playDoubleJump();
        this.createSparkles(this.player.x, this.player.y + 10, 0x38bdf8, 5);
        if (!this.isAttacking) this.player.setTexture('player_jump');
      }
    }

    // Airborne animation
    if (!onFloor && !this.isAttacking && !this.isDashing) {
      if (this.player.body!.velocity.y < -50) {
        this.player.setTexture('player_jump');
      } else if (this.player.body!.velocity.y > 50) {
        this.player.setTexture('player_fall');
      }
    }

    // Fall into pit hazard
    if (this.player.y > this.currentLevel.height + 40) {
      this.handlePlayerDamage(1, 'Jatuh ke Jurang');
      if (this.playerHp > 0) {
        this.player.setPosition(this.respawnPoint.x, this.respawnPoint.y);
        this.player.setVelocity(0, 0);
      }
    }
  }

  public respawnAtCheckpoint() {
    this.playerHp = 5;
    this.mana = 100;
    if (this.player) {
      this.player.enableBody(true, this.respawnPoint.x, this.respawnPoint.y, true, true);
      if (this.player.body) {
        this.player.setVelocity(0, 0);
      }
    }
    this.broadcastStatus();
  }

  shutdown() {
    if (this.input && this.input.keyboard) {
      this.input.keyboard.removeAllListeners();
    }
  }
}
