/*
 *
 * HomePage actions
 *
 */

import {
  TEST,
  INITIALIZE_GAME,
  IMAGES_LOADED,
  CANVAS_READY,
  SET_CANVAS,
  GENERATE_LEVEL,
  HANDLE_KEY_DOWN,
  HANDLE_KEY_UP,
  UPDATE_ALL,
  INCREMENT_LEVEL,
  SHOW_LEVEL_LOADER,
  LOAD_NEXT_LEVEL,
  UPDATE_LEVEL_MAP,
  UPDATE_GAME_STATE,
  MOUSE_MOVE,
  MOUSE_DOWN,
  MOUSE_UP,
  PLAYER_DIED,
  RESET_GAME,
  GAME_WON,
} from './constants';

export function test(payload) {
  return {
    type: TEST,
    payload,
  };
}

export function initializeGame() {
  return {
    type: INITIALIZE_GAME,
  };
}

export function imagesLoaded(payload) {
  return {
    type: IMAGES_LOADED,
    payload,
  };
}

export function handleKeyDown(payload) {
  return {
    type: HANDLE_KEY_DOWN,
    payload,
  };
}

export function handleKeyUp(payload) {
  return {
    type: HANDLE_KEY_UP,
    payload,
  };
}

export function updateAll(payload) {
  return {
    type: UPDATE_ALL,
    payload,
  };
}

export function updateLevelMap(payload) {
  return {
    type: UPDATE_LEVEL_MAP,
    payload,
  };
}

export function updateGameState(payload) {
  return {
    type: UPDATE_GAME_STATE,
    payload,
  };
}

export function incrementLevel() {
  return {
    type: INCREMENT_LEVEL,
  };
}


export function loadNextLevel() {
  return {
    type: LOAD_NEXT_LEVEL,
  };
}

export function mouseDown(payload) {
  return {
    type: MOUSE_DOWN,
    payload,
  };
}

export function mouseUp(payload) {
  return {
    type: MOUSE_UP,
    payload,
  };
}

export function mouseMove(payload) {
  return {
    type: MOUSE_MOVE,
    payload,
  };
}

export function playerDied() {
  return {
    type: PLAYER_DIED,
  };
}

export function gameWon() {
  return {
    type: GAME_WON,
  };
}

export function resetGame() {
  return {
    type: RESET_GAME,
  };
}
