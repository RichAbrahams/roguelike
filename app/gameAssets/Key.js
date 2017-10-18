import Annotation from './Annotation';

function Key(x, y) {
  this.x = x;
  this.y = y;
  this.collected = false;
  this.radius = 20;

  this.center = function () {
    return [this.x + this.halfWidth, this.y + this.halfHeight];
  };

  this.update = function () {
    if (!this.collected) {
      const distanceToPlayer = this.findDistanceBetweenSprites(this, this.player);
      if (distanceToPlayer < this.radius) {
        this.collected = true;
        this.exit.open = true;
        this.annotations.push(new Annotation(this.x, this.y, 'Exit Key', 'gold', Date.now() + 1000));
      }
    }
  };

  this.render = function (context) {
    if (!this.collected) {
      const image = 'key';
      const imageX = this.spriteData.frames[image].frame.x;
      const imageY = this.spriteData.frames[image].frame.y;
      const imageWidth = this.mapTileSize;
      const imageHeight = this.mapTileSize;
      context.drawImage(this.spriteSheet, imageX, imageY, imageWidth, imageHeight, this.x, this.y, imageWidth, imageHeight);
    }
  };
}

export default Key;
