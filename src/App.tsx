/**
 * Main Application Component
 * Aetheria: Crystal Legend - Fantasy Pixel Anime Platformer
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { createPhaserGame } from './game/config';
import { GameScene } from './game/GameScene';
import { sound } from './game/audio';
import { gameEvents, GameStatus } from './game/events';
import { GameHUD } from './components/GameHUD';
import { TouchController } from './components/TouchController';
import { DialogueBox } from './components/DialogueBox';
import { TitleMenu } from './components/TitleMenu';
import { PauseModal } from './components/PauseModal';
import { LevelClearModal } from './components/LevelClearModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ControlsGuideModal } from './components/ControlsGuideModal';
import { Smartphone } from 'lucide-react';

type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'LEVEL_CLEAR' | 'GAME_OVER' | 'VICTORY';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  // App & Game State
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(0);
  const [totalCrystals, setTotalCrystals] = useState<number>(0);

  // Modals & Panels
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(false);
  const [activeDialogue, setActiveDialogue] = useState<{
    speaker: string;
    text: string;
    avatar: 'hero' | 'boss';
  } | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string>('Kekuatan Habis');

  // Touch Controller Visibility
  const [touchControlsVisible, setTouchControlsVisible] = useState<boolean>(true);
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  // Audio State
  const [sfxOn, setSfxOn] = useState<boolean>(sound.isSfxEnabled());
  const [bgmOn, setBgmOn] = useState<boolean>(sound.isMusicEnabled());

  // In-Game Status synced from Phaser
  const [status, setStatus] = useState<GameStatus>({
    hp: 5,
    maxHp: 5,
    mana: 100,
    maxMana: 100,
    score: 0,
    crystals: 0,
    hasKey: false,
    levelId: 1,
    levelName: 'Whispering Woods',
    isPaused: false,
  });

  // Load saved high score & level progress on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('aetheria_highscore');
    const savedCrystals = localStorage.getItem('aetheria_crystals');
    const savedUnlocked = localStorage.getItem('aetheria_unlocked_level');

    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    if (savedCrystals) setTotalCrystals(parseInt(savedCrystals, 10));
    if (savedUnlocked) setUnlockedLevel(parseInt(savedUnlocked, 10));

    // Check orientation
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    // Auto detect touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setTouchControlsVisible(hasTouch);

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  // Listen to Game Events from Phaser
  useEffect(() => {
    const unsubscribe = gameEvents.subscribe((event) => {
      switch (event.type) {
        case 'STATUS_UPDATE':
          setStatus(event.payload);
          break;

        case 'LEVEL_COMPLETE':
          setGameState('LEVEL_CLEAR');
          setCurrentLevelIndex(event.payload.levelIndex);
          // Update high score & unlocks
          const newScore = Math.max(highScore, event.payload.score);
          setHighScore(newScore);
          localStorage.setItem('aetheria_highscore', String(newScore));

          const newTotalCrystals = totalCrystals + event.payload.crystals;
          setTotalCrystals(newTotalCrystals);
          localStorage.setItem('aetheria_crystals', String(newTotalCrystals));

          const nextLevel = Math.min(3, event.payload.levelId + 1);
          setUnlockedLevel((prev) => {
            const val = Math.max(prev, nextLevel);
            localStorage.setItem('aetheria_unlocked_level', String(val));
            return val;
          });
          break;

        case 'GAME_OVER':
          setGameOverReason(event.payload.reason);
          setGameState('GAME_OVER');
          break;

        case 'GAME_VICTORY':
          setGameState('VICTORY');
          const finalScore = Math.max(highScore, event.payload.totalScore);
          setHighScore(finalScore);
          localStorage.setItem('aetheria_highscore', String(finalScore));

          const finalCrystals = totalCrystals + event.payload.totalCrystals;
          setTotalCrystals(finalCrystals);
          localStorage.setItem('aetheria_crystals', String(finalCrystals));
          break;

        case 'DIALOGUE':
          setActiveDialogue(event.payload);
          break;
      }
    });

    return () => unsubscribe();
  }, [highScore, totalCrystals]);

  // Start or restart Phaser instance
  const launchGame = useCallback((levelIdx: number, carryScore: number = 0, carryCrystals: number = 0) => {
    setCurrentLevelIndex(levelIdx);
    setGameState('PLAYING');
    setActiveDialogue(null);

    // If Phaser is already active and running, smoothly switch scene to next level without destroying canvas!
    if (phaserGameRef.current) {
      phaserGameRef.current.scene.start('GameScene', {
        levelIndex: levelIdx,
        score: carryScore,
        crystals: carryCrystals,
      });
      return;
    }

    // Otherwise, create a fresh Phaser instance on first launch
    setTimeout(() => {
      if (containerRef.current) {
        const game = createPhaserGame(containerRef.current, {
          levelIndex: levelIdx,
          score: carryScore,
          crystals: carryCrystals,
        });
        phaserGameRef.current = game;
      }
    }, 50);
  }, []);

  // Cleanup Phaser on unmount
  useEffect(() => {
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Controls & Handlers
  const handleToggleSfx = () => {
    const next = !sfxOn;
    sound.setSfxEnabled(next);
    setSfxOn(next);
  };

  const handleToggleBgm = () => {
    const next = !bgmOn;
    sound.setMusicEnabled(next);
    setBgmOn(next);
  };

  const handlePause = () => {
    if (gameState === 'PLAYING') {
      if (phaserGameRef.current) {
        phaserGameRef.current.scene.pause('GameScene');
      }
      setGameState('PAUSED');
    }
  };

  const handleResume = () => {
    if (gameState === 'PAUSED') {
      if (phaserGameRef.current) {
        phaserGameRef.current.scene.resume('GameScene');
      }
      setGameState('PLAYING');
    }
  };

  const handleRestartLevel = () => {
    launchGame(currentLevelIndex, 0, 0);
  };

  const handleNextLevel = () => {
    const nextIdx = currentLevelIndex + 1;
    launchGame(nextIdx, status.score, status.crystals);
  };

  const handleHome = () => {
    sound.stopBGM();
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
    setGameState('TITLE');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* 1. TITLE SCREEN */}
      {gameState === 'TITLE' && (
        <TitleMenu
          highScore={highScore}
          totalCrystals={totalCrystals}
          sfxOn={sfxOn}
          bgmOn={bgmOn}
          onToggleSfx={handleToggleSfx}
          onToggleBgm={handleToggleBgm}
          onStartGame={() => launchGame(0)}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenControls={() => setIsControlsOpen(true)}
        />
      )}

      {/* 2. GAME CANVAS VIEWPORT */}
      {gameState !== 'TITLE' && (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
          {/* Portrait orientation gentle suggestion banner */}
          {isPortrait && (
            <div className="absolute top-14 left-4 right-4 z-40 bg-amber-950/90 border border-amber-600/70 text-amber-200 text-xs px-3 py-2 rounded-xl backdrop-blur-md shadow-xl flex items-center gap-2 pointer-events-auto">
              <Smartphone className="w-4 h-4 shrink-0 text-amber-400 rotate-90" />
              <span>Putar layar horizontal (landscape) untuk tampilan arena lebih luas!</span>
            </div>
          )}

          {/* Phaser Canvas Container */}
          <div
            id="phaser-game-container"
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
          />

          {/* HUD Overlay */}
          <GameHUD
            status={status}
            sfxOn={sfxOn}
            bgmOn={bgmOn}
            onToggleSfx={handleToggleSfx}
            onToggleBgm={handleToggleBgm}
            onPause={handlePause}
            onOpenHelp={() => setIsControlsOpen(true)}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Virtual Touch Controller for Tablet & Mobile */}
          <TouchController
            visible={touchControlsVisible}
            onToggleVisible={() => setTouchControlsVisible((prev) => !prev)}
          />

          {/* Story Dialogue Box */}
          {activeDialogue && (
            <DialogueBox
              speaker={activeDialogue.speaker}
              text={activeDialogue.text}
              avatar={activeDialogue.avatar}
              onDismiss={() => setActiveDialogue(null)}
            />
          )}
        </div>
      )}

      {/* 3. MODALS */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestartLevel}
          onHome={handleHome}
          sfxOn={sfxOn}
          bgmOn={bgmOn}
          onToggleSfx={handleToggleSfx}
          onToggleBgm={handleToggleBgm}
        />
      )}

      {gameState === 'LEVEL_CLEAR' && (
        <LevelClearModal
          levelId={status.levelId}
          score={status.score}
          crystals={status.crystals}
          onNextLevel={handleNextLevel}
          onRestart={handleRestartLevel}
          onHome={handleHome}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverModal
          reason={gameOverReason}
          onRetry={handleRestartLevel}
          onHome={handleHome}
        />
      )}

      {gameState === 'VICTORY' && (
        <VictoryModal
          totalScore={status.score}
          totalCrystals={status.crystals}
          onPlayAgain={() => launchGame(0)}
          onHome={handleHome}
        />
      )}

      {/* Level Select Modal */}
      {isLevelSelectOpen && (
        <LevelSelectModal
          unlockedLevel={unlockedLevel}
          onSelectLevel={(levelIdx) => {
            setIsLevelSelectOpen(false);
            launchGame(levelIdx);
          }}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      )}

      {/* Controls Guide Modal */}
      {isControlsOpen && (
        <ControlsGuideModal onClose={() => setIsControlsOpen(false)} />
      )}
    </div>
  );
}
