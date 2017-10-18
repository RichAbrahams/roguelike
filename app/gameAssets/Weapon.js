import Annotation from './Annotation';

function Weapon(x, y, bonus) {
  this.x = x;
  this.y = y;
  this.collected = false;
  this.radius = 20;
  this.bonus = bonus;

  this.center = function () {
    return [this.x + this.halfWidth, this.y + this.halfHeight];
  };

  this.update = function () {
    if (!this.collected) {
      const distanceToPlayer = this.findDistanceBetweenSprites(this, this.player);
      if (distanceToPlayer < this.radius) {
        this.collected = true;
        this.player.weapon += this.bonus;
        this.annotations.push(new Annotation(this.x, this.y, `weapon +${this.bonus}`, 'gold', Date.now() + 1000));
      }
    }
  };

  this.render = function (context) {
    if (!this.collected) {
      const image = 'sword';
      const imageX = this.spriteData.frames[image].frame.x;
      const imageY = this.spriteData.frames[image].frame.y;
      const imageWidth = this.mapTileSize;
      const imageHeight = this.mapTileSize;
      context.drawImage(this.spriteSheet, imageX, imageY, imageWidth, imageHeight, this.x, this.y, imageWidth, imageHeight);
    }
  };
}

export default Weapon;
