/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import levelConfig from 'gameAssets/levelConfig';
import LevelMap from 'gameAssets/LevelMap';

import {
  TEST,
  IMAGES_LOADED,
  BUILD_LEVEL,
  INCREMENT_LEVEL,
  SHOW_LEVEL_LOADER,
  GAME_STATE_PLAY,
  LOADING,
  INTRO,
  PLAY,
  PAUSE,
  LEVEL,
  GAME_OVER,
  GAME_WON,
  RESET_GAME,
  HANDLE_KEY_DOWN,
  ATTACK,
  BLOCK,
  SPACE,
  UPDATE_ALL,
  UPDATE_LEVEL_MAP,
  UPDATE_GAME_STATE,
  MOUSE_MOVE,
  MOUSE_DOWN,
  MOUSE_UP,
} from './constants';

const initialState = fromJS({
  interstitialText: { l1: 'Loading', l2: null },
  gameState: LOADING,
  nextUpdate: 0,
  currentLevel: 0,
  playerLevel: 1,
  playerHealth: 100,
  playerMaxHealth: 100,
  playerDamage: 10,
  playerWeapon: 0,
  playerXP: 0,
  mouseHeld: false,
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case TEST: {
      const levelMap = state.get('levelMap');
      console.log('x', action.payload.offsetX);
      console.log('y', action.payload.offsetY);
      const index = levelMap.getArrayIndex(action.payload.offsetX, action.payload.offsetY);
      console.log(levelMap.mapTiles[index]);
      return state.set('levelMap', levelMap);
    }
    case IMAGES_LOADED: {
      const { spriteSheet, spriteData } = action.payload;
      return state.merge({ spriteSheet, spriteData, gameState: INTRO, interstitialText: { l1: 'Rogue', l2: 'Press Space To Start' } });
    }
    case UPDATE_LEVEL_MAP: {
      return state.merge({
        levelMap: action.payload,
        playerLevel: action.payload.player.level,
        playerHealth: action.payload.player.health,
        playerMaxHealth: action.payload.player.maxHealth,
        playerDamage: action.payload.player.damage,
        playerWeapon: action.payload.player.weapon,
        playerXP: action.payload.player.xp,
        playerNextLevel: action.payload.player.nextLevel,
      });
    }
    case UPDATE_GAME_STATE: {
      const { gameState, interstitialText } = action.payload;
      return state.merge({ gameState, interstitialText });
    }
    case INCREMENT_LEVEL: {
      let currentLevel = state.get('currentLevel');
      currentLevel += 1;
      return state.set('currentLevel', currentLevel);
    }
    case HANDLE_KEY_DOWN: {
      const input = action.payload;
      if (input !== SPACE) {
        const levelMap = state.get('levelMap');
        if (!levelMap.player.actionEnd && input === ATTACK) {
          levelMap.player.attacking = true;
        }
        if (!levelMap.player.actionEnd && input === BLOCK) {
          levelMap.player.blocking = true;
        }
        return state.set('levelMap', levelMap);
      }
      const gameState = state.get('gameState');
      if (gameState === INTRO) {
        return state.merge({ gameState: LEVEL, interstitialText: { l1: null, l2: null, l3: null, l4: null, l5: null } });
      }
      if (gameState === PLAY) {
        return state.merge({ gameState: PAUSE, interstitialText: { l1: 'Paused', l2: 'Press space to resume', l3: null, l4: null, l5: null } });
      }
      if (gameState === PAUSE) {
        return state.merge({ gameState: PLAY, interstitialText: { l1: null, l2: null, l3: null, l4: null, l5: null } });
      }
      return state;
    }
    case MOUSE_MOVE: {
      const levelMap = state.get('levelMap');
      levelMap.player.setMoveTo(action.payload.mouseX, action.payload.mouseY);
      return state.set('levelMap', levelMap);
    }
    case MOUSE_DOWN: {
      const levelMap = state.get('levelMap');
      const mouseHeld = true;
      levelMap.player.setMoveTo(action.payload.offsetX, action.payload.offsetY);
      return state.merge({ levelMap, mouseHeld });
    }
    case MOUSE_UP: {
      return state.set('mouseHeld', false);
    }
    case RESET_GAME: {
      console.log('resetting');
      return state.merge({
        nextUpdate: 0,
        currentLevel: 0,
        playerLevel: 1,
        playerHealth: 100,
        playerMaxHealth: 100,
        playerDamage: 10,
        playerWeapon: 0,
        playerXP: 0,
      });
    }
    default:
      return state;
  }
}

export default homePageReducer;
