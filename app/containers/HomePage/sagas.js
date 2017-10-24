import { takeLatest, delay } from 'redux-saga';
import { fork, call, put, select } from 'redux-saga/effects';
import LevelMap from 'gameAssets/LevelMap';
import {
  INITIALIZE_GAME,
  LOAD_NEXT_LEVEL,
  UPDATE_ALL,
  INTRO,
  LEVEL,
  PLAY,
  GAME_OVER,
  PLAYER_DIED,
  GAME_WON,
} from './constants';
import * as actions from './actions';
import * as selectors from './selectors';
import spriteData from '../../images/rogueSprites.json';
import sprites from '../../images/rogueSprites.png';

function imageLoader(image) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.src = image;
  });
}

function* buildLevel() {
  const currentLevel = yield select(selectors.currentLevel());
  const spriteSheet = yield select(selectors.spriteSheet());
  const spriteJSON = yield select(selectors.spriteData());
  const playerLevel = yield select(selectors.playerLevel());
  const playerWeapon = yield select(selectors.playerWeapon());
  const playerXP = yield select(selectors.playerXP());
  const levelMap = new LevelMap(currentLevel, spriteSheet, spriteJSON.toJS());
  levelMap.initializeMap();
  levelMap.generatePlayer(playerLevel, playerWeapon, playerXP);
  return levelMap;
}

function* initializeGame() {
  const spriteSheet = yield call(imageLoader, sprites);
  yield put(actions.imagesLoaded({
    spriteSheet,
    spriteData,
  }));
  yield put(actions.updateGameState({
    gameState: INTRO,
    interstitialText: { l1: 'Rogue', l2: 'Press Space To Start', l3: 'Move: Left Mouse', l4: 'Attack: Q', l5: 'Stun: W' },
  }));
}

function* loadNextLevel() {
  const currentLevel = yield select(selectors.currentLevel());
  if (currentLevel < 5) {
    yield put(actions.incrementLevel());
    const levelMap = yield buildLevel();
    yield put(actions.updateLevelMap(levelMap));
    yield put(actions.updateGameState({
      gameState: LEVEL,
      interstitialText: { l1: `Floor ${currentLevel + 1}`, l2: null, l3: null, l4: null, l5: null },
    }));
    yield delay(3000);
    yield put(actions.updateGameState({
      gameState: PLAY,
      interstitialText: { l1: null, l2: null, l3: null, l4: null, l5: null },
    }));
  }
}

function* playerDied() {
  yield put(actions.updateGameState({
    gameState: GAME_OVER,
    interstitialText: { l1: 'Game Over', l2: 'You Died!', l3: null, l4: null, l5: null },
  }));
  yield delay(5000);
  yield put(actions.resetGame());
  yield put(actions.updateGameState({
    gameState: INTRO,
    interstitialText: { l1: 'Rogue', l2: 'Press Space To Start', l3: 'Move: Left Mouse', l4: 'Attack: Q', l5: 'Stun: W' },
  }));
}

function* gameWon() {
  yield put(actions.updateGameState({
    gameState: GAME_WON,
    interstitialText: { l1: 'Congratulations!', l2: 'Game Completed', l3: null, l4: null, l5: null },
  }));
  yield put(actions.resetGame());
  yield delay(10000);
  yield put(actions.updateGameState({
    gameState: INTRO,
    interstitialText: { l1: 'Rogue', l2: 'Press Space To Start', l3: 'Move: Left Mouse', l4: 'Attack: Q', l5: 'Stun: W' },
  }));
}

function* updateAll() {
  const levelMap = yield select(selectors.levelMap());
  if (levelMap.player.health <= 0) {
    yield put(actions.playerDied());
  }
  if (levelMap.levelCompleted) {
    if (levelMap.currentLevel === 5) {
      yield put(actions.gameWon());
    } else {
      yield put(actions.loadNextLevel());
    }
  } else {
    levelMap.updateAll();
    yield put(actions.updateLevelMap(levelMap));
  }
}

export function* watcher() {
  yield fork(takeLatest, INITIALIZE_GAME, initializeGame);
  yield fork(takeLatest, LOAD_NEXT_LEVEL, loadNextLevel);
  yield fork(takeLatest, UPDATE_ALL, updateAll);
  yield fork(takeLatest, PLAYER_DIED, playerDied);
  yield fork(takeLatest, GAME_WON, gameWon);
}

export default [
  watcher,
];
