import { createSelector } from 'reselect';

/**
 * Direct selector to the homePage state domain
 */
const selectHomePageDomain = () => (state) => state.get('homePage');

const gameState = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('gameState')
);

const interstitialText = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('interstitialText').toJS()
);

const nextUpdate = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('nextUpdate')
);

const canvasWidth = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('canvasWidth')
);

const canvasHeight = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('canvasHeight')
);

const currentLevel = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('currentLevel')
);

const levelMap = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('levelMap')
);

const spriteSheet = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('spriteSheet')
);

const spriteData = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('spriteData')
);

const mouseHeld = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('mouseHeld')
);

const playerLevel = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerLevel')
);

const playerHealth = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerHealth')
);

const playerMaxHealth = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerMaxHealth')
);

const playerDamage = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerDamage')
);

const playerWeapon = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerWeapon')
);

const playerXP = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerXP')
);

const playerNextLevel = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.get('playerNextLevel')
);

export {
  gameState,
  interstitialText,
  nextUpdate,
  canvasWidth,
  canvasHeight,
  currentLevel,
  levelMap,
  spriteSheet,
  spriteData,
  mouseHeld,
  playerLevel,
  playerHealth,
  playerMaxHealth,
  playerDamage,
  playerWeapon,
  playerXP,
  playerNextLevel,
};
