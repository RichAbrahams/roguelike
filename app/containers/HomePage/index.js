/*
 *
 * HomePage
 *
 */

import React, { PropTypes } from 'react';
import Header from 'components/Header';
import Main from 'components/Main';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as actions from './actions';
import * as selectors from './selectors';
import { Wrapper, SubWrapper } from './styles';
import {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  ATTACK,
  BLOCK,
  SPACE,
  PLAY,
  INTRO,
} from './constants';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  componentDidMount() {
    this.props.initializeGame();
  }

  handleKeyDown(e) {
    e.preventDefault();
    const input = e.keyCode;
    if (input === SPACE) {
      if (this.props.gameState === INTRO) {
        this.props.loadNextLevel();
      } else {
        this.props.handleKeyDown(input);
      }
    } else if ((input === ATTACK || input === BLOCK) && this.props.gameState === PLAY) {
      this.props.handleKeyDown(input);
    }
  }

  handleKeyUp(e) {
    e.preventDefault();
    const input = e.keyCode;
    if ((input === ATTACK || input === BLOCK) && this.props.gameState === PLAY) {
      this.props.handleKeyUp(input);
    }
  }

  render() {
    return (
      <Wrapper className="Wrapper">
        <Header />
        <SubWrapper className="MainWrapper">
          <Main {...this.props} />
        </SubWrapper>
      </Wrapper>
    );
  }
}

HomePage.propTypes = {
  initializeGame: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  gameState: selectors.gameState(),
  interstitialText: selectors.interstitialText(),
  nextUpdate: selectors.nextUpdate(),
  canvasWidth: selectors.canvasWidth(),
  canvasHeight: selectors.canvasHeight(),
  levelMap: selectors.levelMap(),
  mouseHeld: selectors.mouseHeld(),
  playerLevel: selectors.playerLevel(),
  playerHealth: selectors.playerHealth(),
  playerMaxHealth: selectors.playerMaxHealth(),
  playerDamage: selectors.playerDamage(),
  playerWeapon: selectors.playerWeapon(),
  playerXP: selectors.playerXP(),
  playerNextLevel: selectors.playerNextLevel(),
});

function mapDispatchToProps(dispatch) {
  return {
    initializeGame: () => dispatch(actions.initializeGame()),
    handleKeyDown: (payload) => dispatch(actions.handleKeyDown(payload)),
    handleKeyUp: (payload) => dispatch(actions.handleKeyUp(payload)),
    updateAll: (payload) => dispatch(actions.updateAll(payload)),
    test: (payload) => dispatch(actions.test(payload)),
    loadNextLevel: () => dispatch(actions.loadNextLevel()),
    mouseUp: (e) => dispatch(actions.mouseUp(e)),
    mouseDown: (e) => dispatch(actions.mouseDown(e)),
    mouseMove: (e) => dispatch(actions.mouseMove(e)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
