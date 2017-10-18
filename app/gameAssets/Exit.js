import Annotation from './Annotation';

function Exit(x, y) {
  this.x = x;
  this.y = y;
  this.open = false;
  this.radius = 20;
  this.nextAnnotation = 0;

  this.center = function () {
    return [this.x + this.halfWidth, this.y + this.halfHeight];
  };

  this.update = function () {
    const distanceToPlayer = this.findDistanceBetweenSprites(this, this.player);
    if (distanceToPlayer < this.radius && Date.now() > this.nextAnnotation) {
      if (this.open) {
        this.levelComplete();
      } else {
        this.nextAnnotation = Date.now() + 5000;
        this.annotations.push(new Annotation(this.x, this.y, 'Exit Locked', 'red', Date.now() + 1000));
      }
    }
  };

  this.render = function (context) {
    const image = this.open ? 'doorOpen' : 'doorClosed';
    const imageX = this.spriteData.frames[image].frame.x;
    const imageY = this.spriteData.frames[image].frame.y;
    const imageWidth = this.mapTileSize;
    const imageHeight = this.mapTileSize;
    context.drawImage(this.spriteSheet, imageX, imageY, imageWidth, imageHeight, this.x, this.y, imageWidth, imageHeight);
  };
}

export default Exit;
