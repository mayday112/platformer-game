/**
 * Event emitter and shared state between Phaser and React UI
 */

export interface GameStatus {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  score: number;
  crystals: number;
  hasKey: boolean;
  levelId: number;
  levelName: string;
  isPaused: boolean;
  bossHp?: number;
  bossMaxHp?: number;
}

export type GameEvent =
  | { type: 'STATUS_UPDATE'; payload: GameStatus }
  | { type: 'LEVEL_START'; payload: { levelId: number; name: string } }
  | { type: 'LEVEL_COMPLETE'; payload: { levelId: number; levelIndex: number; score: number; crystals: number } }
  | { type: 'GAME_OVER'; payload: { levelId: number; reason: string } }
  | { type: 'GAME_VICTORY'; payload: { totalScore: number; totalCrystals: number } }
  | { type: 'DIALOGUE'; payload: { speaker: string; text: string; avatar: 'hero' | 'boss' } };

type Listener = (event: GameEvent) => void;

class GameEventBus {
  private listeners: Listener[] = [];

  public subscribe(cb: Listener): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public emit(event: GameEvent) {
    this.listeners.forEach((cb) => cb(event));
  }
}

export const gameEvents = new GameEventBus();

// Virtual gamepad state passed from React Touch HUD to Phaser
export const virtualGamepad = {
  left: false,
  right: false,
  down: false,
  jump: false,
  attack: false,
  magic: false,
  dash: false,
};
