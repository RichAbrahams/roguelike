/**
*
* Main
*
*/

import React from 'react';
import {
  PLAY,
} from 'containers/HomePage/constants';
import Interstitial from '../Interstitial';
import StatusBar from '../StatusBar';
import Canvas from '../Canvas';

const content = (props) => {
  let output;
  switch (props.gameState) {
    case PLAY:
      output = <div><StatusBar {...props} /><Canvas {...props} /></div>;
      break;
    default:
      output = <Interstitial {...props} />;
      break;
  }
  return output;
};

function Main(props) {
  return (content(props)
  );
}

Main.propTypes = {

};

export default Main;
