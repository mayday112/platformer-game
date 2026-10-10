/**
 * Level Definitions for Aetheria: Crystal Legend
 */

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'grass' | 'stone' | 'crystal';
}

export interface MovingPlatformDef {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
}

export interface CrumblingPlatformDef {
  x: number;
  y: number;
}

export interface SpikeDef {
  x: number;
  y: number;
  count?: number;
}

export interface SpringDef {
  x: number;
  y: number;
}

export interface CrystalDef {
  x: number;
  y: number;
}

export interface PotionDef {
  x: number;
  y: number;
}

export interface EnemyDef {
  x: number;
  y: number;
  type: 'slime' | 'bat' | 'skeleton';
  patrolDist?: number;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  theme: 'forest' | 'cavern' | 'boss';
  width: number;
  height: number;
  playerStart: { x: number; y: number };
  goal: { x: number; y: number };
  hasKey?: boolean;
  keyPos?: { x: number; y: number };
  checkpoint?: { x: number; y: number };
  platforms: PlatformDef[];
  movingPlatforms?: MovingPlatformDef[];
  crumblingPlatforms?: CrumblingPlatformDef[];
  spikes: SpikeDef[];
  springs: SpringDef[];
  crystals: CrystalDef[];
  potions: PotionDef[];
  enemies: EnemyDef[];
  boss?: {
    x: number;
    y: number;
    hp: number;
  };
  dialogue?: {
    speaker: string;
    text: string;
    avatar: 'hero' | 'boss';
  }[];
}

export const LEVELS: LevelData[] = [
  // --- LEVEL 1: The Whispering Woods ---
  {
    id: 1,
    name: 'Whispering Woods',
    subtitle: 'Hutan Roh Kristal',
    theme: 'forest',
    width: 2200,
    height: 600,
    playerStart: { x: 80, y: 450 },
    goal: { x: 2100, y: 440 },
    checkpoint: { x: 1050, y: 450 },
    dialogue: [
      {
        speaker: 'Lyra',
        text: 'Kekuatan kristal di Hutan Roh sedang memudar... Malacor pasti sudah mulai menyerap energi Aetheria!',
        avatar: 'hero',
      },
      {
        speaker: 'Lyra',
        text: 'Aku harus melintasi pulau terapung ini, kumpulkan kristal mana, dan hancurkan monster bayangan.',
        avatar: 'hero',
      },
    ],
    platforms: [
      // Starting ground
      { x: 0, y: 520, w: 420, h: 80, type: 'grass' },
      // First floating stepping stones
      { x: 300, y: 440, w: 100, h: 20, type: 'grass' },
      { x: 440, y: 380, w: 120, h: 20, type: 'grass' },
      { x: 600, y: 320, w: 140, h: 20, type: 'grass' },
      // Lower valley with bouncing mushroom
      { x: 500, y: 520, w: 320, h: 80, type: 'grass' },
      // High cliff
      { x: 820, y: 380, w: 180, h: 20, type: 'grass' },
      // Checkpoint plateau
      { x: 1000, y: 480, w: 260, h: 120, type: 'grass' },
      // Elevated islands
      { x: 1300, y: 420, w: 120, h: 20, type: 'grass' },
      { x: 1460, y: 350, w: 130, h: 20, type: 'grass' },
      { x: 1630, y: 290, w: 140, h: 20, type: 'grass' },
      // Lower path with enemies and rewards
      { x: 1350, y: 520, w: 300, h: 80, type: 'grass' },
      // Goal sanctuary plateau
      { x: 1820, y: 480, w: 380, h: 120, type: 'grass' },
      { x: 1940, y: 380, w: 100, h: 20, type: 'grass' },
    ],
    springs: [
      { x: 740, y: 504 },
      { x: 1560, y: 504 },
    ],
    spikes: [
      { x: 430, y: 580, count: 4 },
      { x: 1270, y: 580, count: 5 },
      { x: 1660, y: 580, count: 6 },
    ],
    crystals: [
      { x: 200, y: 480 },
      { x: 350, y: 400 },
      { x: 490, y: 340 },
      { x: 670, y: 280 },
      { x: 880, y: 340 },
      { x: 740, y: 220 }, // High spring reward
      { x: 1120, y: 440 },
      { x: 1360, y: 380 },
      { x: 1520, y: 310 },
      { x: 1700, y: 250 },
      { x: 1450, y: 480 },
      { x: 2000, y: 340 },
      { x: 2060, y: 440 },
    ],
    potions: [
      { x: 660, y: 280 },
      { x: 1480, y: 480 },
    ],
    enemies: [
      { x: 260, y: 500, type: 'slime', patrolDist: 80 },
      { x: 600, y: 500, type: 'slime', patrolDist: 90 },
      { x: 890, y: 360, type: 'slime', patrolDist: 50 },
      { x: 1180, y: 460, type: 'bat', patrolDist: 70 },
      { x: 1420, y: 500, type: 'slime', patrolDist: 70 },
      { x: 1580, y: 310, type: 'bat', patrolDist: 80 },
      { x: 1900, y: 460, type: 'skeleton', patrolDist: 90 },
    ],
  },

  // --- LEVEL 2: Crystal Sanctum ---
  {
    id: 2,
    name: 'Crystal Sanctum',
    subtitle: 'Kuil Kristal Kuno',
    theme: 'cavern',
    width: 2400,
    height: 650,
    playerStart: { x: 80, y: 500 },
    goal: { x: 2300, y: 370 },
    hasKey: true,
    keyPos: { x: 1450, y: 150 }, // Hidden on high altar requiring precision platforming
    checkpoint: { x: 1100, y: 480 },
    dialogue: [
      {
        speaker: 'Lyra',
        text: 'Pintu gerbang menuju puncak menara terkunci dengan segel sihir kuno!',
        avatar: 'hero',
      },
      {
        speaker: 'Lyra',
        text: 'Aku harus menemukan Kunci Kristal Emas di kuil atas sebelum gerbang mistik bisa terbuka.',
        avatar: 'hero',
      },
    ],
    platforms: [
      // Starting chamber
      { x: 0, y: 560, w: 340, h: 90, type: 'stone' },
      // First gap and crystal ledges
      { x: 380, y: 500, w: 100, h: 20, type: 'crystal' },
      { x: 520, y: 440, w: 120, h: 20, type: 'stone' },
      // Lower pit with spikes and spring
      { x: 420, y: 620, w: 300, h: 30, type: 'stone' },
      // Mid platform
      { x: 700, y: 380, w: 140, h: 20, type: 'crystal' },
      // High route towards Key altar
      { x: 900, y: 310, w: 130, h: 20, type: 'stone' },
      { x: 1100, y: 240, w: 140, h: 20, type: 'crystal' },
      { x: 1380, y: 190, w: 160, h: 20, type: 'stone' }, // Key Altar!
      // Checkpoint room (lower)
      { x: 950, y: 530, w: 280, h: 120, type: 'stone' },
      // Cavern right side
      { x: 1580, y: 420, w: 130, h: 20, type: 'crystal' },
      { x: 1760, y: 480, w: 140, h: 20, type: 'stone' },
      // Final Gate sanctuary
      { x: 2080, y: 420, w: 320, h: 180, type: 'stone' },
    ],
    movingPlatforms: [
      // Moves horizontally across crystal abyss
      { x: 740, y: 490, dx: 150, dy: 0, speed: 60 },
      // Moves vertically to help reach key altar
      { x: 1270, y: 320, dx: 0, dy: -100, speed: 50 },
      // Moves towards final gate
      { x: 1920, y: 450, dx: 120, dy: 0, speed: 65 },
    ],
    crumblingPlatforms: [
      { x: 620, y: 280 },
      { x: 1520, y: 280 },
      { x: 1720, y: 340 },
    ],
    springs: [
      { x: 560, y: 604 },
      { x: 1180, y: 514 },
    ],
    spikes: [
      { x: 350, y: 630, count: 5 },
      { x: 650, y: 630, count: 6 },
      { x: 1240, y: 630, count: 8 },
      { x: 1400, y: 630, count: 10 },
      { x: 1720, y: 630, count: 6 },
      { x: 800, y: 364, count: 2 },
    ],
    crystals: [
      { x: 220, y: 520 },
      { x: 430, y: 460 },
      { x: 570, y: 400 },
      { x: 760, y: 340 },
      { x: 960, y: 270 },
      { x: 1160, y: 200 },
      { x: 1450, y: 110 }, // Key sparkle
      { x: 1020, y: 490 },
      { x: 1630, y: 380 },
      { x: 1820, y: 440 },
      { x: 2150, y: 380 },
      { x: 2220, y: 380 },
    ],
    potions: [
      { x: 1500, y: 150 },
      { x: 1180, y: 490 },
    ],
    enemies: [
      { x: 240, y: 540, type: 'slime', patrolDist: 60 },
      { x: 560, y: 420, type: 'bat', patrolDist: 60 },
      { x: 740, y: 350, type: 'bat', patrolDist: 50 },
      { x: 1020, y: 510, type: 'skeleton', patrolDist: 80 },
      { x: 1160, y: 210, type: 'bat', patrolDist: 60 },
      { x: 1640, y: 390, type: 'skeleton', patrolDist: 70 },
      { x: 1810, y: 450, type: 'bat', patrolDist: 70 },
      { x: 2120, y: 400, type: 'skeleton', patrolDist: 60 },
    ],
  },

  // --- LEVEL 3: Shadow Spire - The Final Stand ---
  {
    id: 3,
    name: 'Shadow Spire',
    subtitle: 'Klimaks: Pertarungan Lord Malacor',
    theme: 'boss',
    width: 1800,
    height: 600,
    playerStart: { x: 80, y: 460 },
    goal: { x: 1700, y: 460 },
    checkpoint: { x: 450, y: 460 },
    dialogue: [
      {
        speaker: 'Malacor',
        text: 'Hahaha! Gadis kecil berambut safir... Beraninya kau menantang kegelapan mutlakku!',
        avatar: 'boss',
      },
      {
        speaker: 'Lyra',
        text: 'Malacor! Kembalikan kristal jiwa Aetheria, atau pedang runeku yang akan memusnahkan bayanganmu!',
        avatar: 'hero',
      },
      {
        speaker: 'Malacor',
        text: 'Coba kalau kau mampu menembus badai sihir hitamku! Rasakan kehancuranmu!',
        avatar: 'boss',
      },
    ],
    platforms: [
      // Starting foyer
      { x: 0, y: 520, w: 320, h: 80, type: 'stone' },
      // Stepping bridges
      { x: 360, y: 470, w: 120, h: 20, type: 'crystal' },
      // Gate to arena
      { x: 520, y: 420, w: 120, h: 20, type: 'stone' },
      // BOSS ARENA (Wide platform with floating combat ledges)
      { x: 700, y: 500, w: 950, h: 100, type: 'crystal' },
      // High arena battle ledges for dodging and jumping attacks
      { x: 800, y: 380, w: 130, h: 20, type: 'stone' },
      { x: 1080, y: 320, w: 150, h: 20, type: 'crystal' },
      { x: 1370, y: 380, w: 130, h: 20, type: 'stone' },
      // Sanctuary gate at end
      { x: 1650, y: 500, w: 150, h: 100, type: 'stone' },
    ],
    movingPlatforms: [
      { x: 920, y: 440, dx: 140, dy: 0, speed: 50 },
      { x: 1230, y: 440, dx: -140, dy: 0, speed: 50 },
    ],
    springs: [
      { x: 740, y: 484 },
      { x: 1580, y: 484 },
    ],
    spikes: [
      { x: 320, y: 580, count: 3 },
      { x: 640, y: 580, count: 4 },
    ],
    crystals: [
      { x: 150, y: 480 },
      { x: 410, y: 430 },
      { x: 570, y: 380 },
      { x: 860, y: 340 },
      { x: 1150, y: 280 },
      { x: 1430, y: 340 },
      { x: 1000, y: 460 },
      { x: 1300, y: 460 },
      { x: 1700, y: 430 },
    ],
    potions: [
      { x: 830, y: 340 },
      { x: 1400, y: 340 },
    ],
    enemies: [
      { x: 220, y: 490, type: 'skeleton', patrolDist: 60 },
    ],
    boss: {
      x: 1250,
      y: 420,
      hp: 8,
    },
  },
];
