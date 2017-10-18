import { NORTH, SOUTH, EAST, WEST } from './tileConstants';

function Room([direction, startPosition] = [null, null]) {
  this.mapIndexes = [];
  this.northEdges = [];
  this.eastEdges = [];
  this.southEdges = [];
  this.westEdges = [];
  this.exit = null;
  this.startPosition = startPosition;
  this.direction = direction;

  this.generateExit = () => {
    const top = this.northEdges[0][0];
    const right = this.westEdges[0][1];
    const bottom = this.southEdges[0][0];
    const left = this.eastEdges[0][1];
    const directions = [];
    if ((top - 25) > 0 && this.direction !== SOUTH) {
      directions.push([NORTH, this.northEdges]);
    }
    if ((right + 25) < this.mapColumns && this.direction !== EAST) {
      directions.push([WEST, this.westEdges]);
    }
    if ((bottom + 25) < this.mapRows && this.direction !== NORTH) {
      directions.push([SOUTH, this.southEdges]);
    }
    if ((left - 25) > 0 && this.direction !== WEST) {
      directions.push([EAST, this.eastEdges]);
    }
    const selected = directions[this.randomNumber(0, directions.length - 1)];
    const exitIndex = selected[1][this.randomNumber(0, selected[1].length - 1)];
    this.exit = [selected[0], exitIndex];
  };

  this.findMapCenter = () => {
    const startRow = Math.floor(this.mapRows / 2);
    const startColumn = Math.floor(this.mapColumns / 2);
    return [startRow, startColumn];
  };

  this.setStartPosition = () => {
    this.startPosition = this.findMapCenter();
  };

  this.checkForEdge = ([top, bottom, left, right], row, column) => {
    if (row === top) {
      this.northEdges.push([row, column]);
    }
    if (row === bottom) {
      this.southEdges.push([row, column]);
    }
    if (column === left) {
      this.eastEdges.push([row, column]);
    }
    if (column === right) {
      this.westEdges.push([row, column]);
    }
  };

  this.buildNorth = () => {
    const startPositionOffset = this.randomNumber(0, this.width);
    const top = this.startPosition[0] - this.height;
    const bottom = this.startPosition[0];
    const left = this.startPosition[1] - startPositionOffset;
    const right = left + this.width;
    for (let row = top; row <= bottom; row += 1) {
      for (let column = left; column <= right; column += 1) {
        this.mapIndexes.push([row, column]);
        this.checkForEdge([top, bottom, left, right], row, column);
      }
    }
  };

  this.buildSouth = () => {
    const startPositionOffset = this.randomNumber(0, this.width);
    const top = this.startPosition[0];
    const bottom = this.startPosition[0] + this.height;
    const left = this.startPosition[1] - startPositionOffset;
    const right = left + this.width;
    for (let row = top; row <= bottom; row += 1) {
      for (let column = left; column <= right; column += 1) {
        this.mapIndexes.push([row, column]);
        this.checkForEdge([top, bottom, left, right], row, column);
      }
    }
  };

  this.buildEast = () => {
    const startPositionOffset = this.randomNumber(0, this.height);
    const top = this.startPosition[0] - startPositionOffset;
    const bottom = top + this.height;
    const left = this.startPosition[1] - this.width;
    const right = left + this.width;
    for (let row = top; row <= bottom; row += 1) {
      for (let column = left; column <= right; column += 1) {
        this.mapIndexes.push([row, column]);
        this.checkForEdge([top, bottom, left, right], row, column);
      }
    }
  };

  this.buildWest = () => {
    const startPositionOffset = this.randomNumber(0, this.height);
    const top = this.startPosition[0] - startPositionOffset;
    const bottom = top + this.height;
    const left = this.startPosition[1];
    const right = this.startPosition[1] + this.width;
    for (let row = top; row <= bottom; row += 1) {
      for (let column = left; column <= right; column += 1) {
        this.mapIndexes.push([row, column]);
        this.checkForEdge([top, bottom, left, right], row, column);
      }
    }
  };

  this.generateMapIndexes = () => {
    this.width = this.randomNumber(5, 10);
    this.height = this.randomNumber(5, 10);
    if (!this.startPosition) {
      this.setStartPosition();
    }
    if (!this.direction) {
      const arr = [NORTH, SOUTH, EAST, WEST];
      this.direction = arr[this.randomNumber(0, arr.length - 1)];
    }
    if (this.direction === NORTH) {
      this.buildNorth();
    }
    if (this.direction === SOUTH) {
      this.buildSouth();
    }
    if (this.direction === EAST) {
      this.buildEast();
    }
    if (this.direction === WEST) {
      this.buildWest();
    }
    this.generateExit();
  };
}

export default Room;
