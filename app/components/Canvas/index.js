/**
*
* Canvas
*
*/

import React from 'react';
import { PLAY } from 'containers/HomePage/constants';
import levelConfig from '../../gameAssets/levelConfig';

class Canvas extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...props) {
    super();
    this.animationLoop = this.animationLoop.bind(this);
    this.drawAll = this.drawAll.bind(this);
    this.animate = null;
  }

  componentDidMount() {
   this.animationLoop();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animate);
  }

  drawAll(ctx) {
    this.props.levelMap.drawAll(ctx);
  }

  animationLoop() {
    const ctx = this.canvas.getContext('2d');
    const loop = (timestamp = 0) => {
      this.animate = requestAnimationFrame(loop);
      this.drawAll(ctx);
      if (timestamp > this.props.nextUpdate) {
        this.props.updateAll(timestamp + (1000 / 30));
      }
    };
    this.animate = requestAnimationFrame(loop);
  }

  handleMouseMove(e) {
    if (this.props.mouseHeld) {
      const mouseY = e.clientY - this.canvas.offsetTop;
      const mouseX = e.clientX - this.canvas.offsetLeft;
      this.props.mouseMove({ mouseX, mouseY });
    }
  }

  render() {
    return (
      <canvas
        width={levelConfig.mapWidth}
        height={levelConfig.mapHeight}
        ref={(c) => {
          this.canvas = c;
        }}
        onMouseDown={(e) => this.props.mouseDown(e)}
        onMouseUp={(e) => this.props.mouseUp(e)}
        onMouseMove={(e) => this.handleMouseMove(e)}
      />
    );
  }
}

Canvas.propTypes = {
  nextUpdate: React.PropTypes.number,
  updateAll: React.PropTypes.func,
};

export default Canvas;
