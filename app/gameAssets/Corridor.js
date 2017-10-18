import { NORTH, SOUTH, EAST, WEST } from './tileConstants';

function Corridor([direction, startPosition]) {
  this.direction = direction;
  this.startPosition = startPosition;
  this.mapIndexes = [];

  this.buildNorth = (startRow, startColumn) => {
    const endRow = startRow - this.length;
    for (let row = startRow; row >= endRow; row -= 1) {
      this.mapIndexes.push([row, startColumn]);
    }
    this.exit = [NORTH, [endRow, startColumn]];
  };

  this.buildSouth = (startRow, startColumn) => {
    const endRow = startRow + this.length;
    for (let row = startRow; row <= endRow; row += 1) {
      this.mapIndexes.push([row, startColumn]);
    }
    this.exit = [SOUTH, [endRow, startColumn]];
  };

  this.buildEast = (startRow, startColumn) => {
    const endColumn = startColumn - this.length;
    for (let column = startColumn; column >= endColumn; column -= 1) {
      this.mapIndexes.push([startRow, column]);
    }
    this.exit = [EAST, [startRow, endColumn]];
  };

  this.buildWest = (startRow, startColumn) => {
    const endColumn = startColumn + this.length;
    for (let column = startColumn; column <= endColumn; column += 1) {
      this.mapIndexes.push([startRow, column]);
    }
    this.exit = [WEST, [startRow, endColumn]];
  };

  this.generateMapIndexes = () => {
    this.length = this.randomNumber(5, 10);
    const [startRow, startColumn] = this.startPosition;
    if (this.direction === NORTH) {
      this.buildNorth(startRow, startColumn);
    }
    if (this.direction === SOUTH) {
      this.buildSouth(startRow, startColumn);
    }
    if (this.direction === EAST) {
      this.buildEast(startRow, startColumn);
    }
    if (this.direction === WEST) {
      this.buildWest(startRow, startColumn);
    }
  };
}

export default Corridor;
