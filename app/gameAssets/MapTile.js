function MapTile(index, x, y, row, column, tileType, neighbours, center, isObstacle, spriteSheetX, spriteSheetY, left, top, bottom, right) {
  this.index = index;
  this.x = x;
  this.y = y;
  this.column = column;
  this.row = row;
  this.tileType = tileType;
  this.center = center;
  this.isObstacle = isObstacle;
  this.neighbours = neighbours;
  this.left = left;
  this.top = top;
  this.bottom = bottom;
  this.right = right;
  this.spriteSheetX = spriteSheetX;
  this.spriteSheetY = spriteSheetY;
}

export default MapTile;
