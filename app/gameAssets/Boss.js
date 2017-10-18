import Annotation from './Annotation';

const PATROL = 0;
const DEAD = 6;

function Boss() {
  this.x = null;
  this.y = null;
  this.routeStart = null;
  this.routeStop = null;
  this.moveSpeed = 0.5;
  this.rotation = 0;
  this.phase = PATROL;
  this.animationCounter = 0;
  this.walkAnimation = 'bossWalk_00';
  this.attackAnimation = 'bossAttack_00';
  this.stunnedAnimation = 'bossStunned_00';
  this.animationAction = this.walkAnimation;
  this.animationFrame = 0;
  this.actionEnd = 0;
  this.patrolRoute = null;
  this.pursueRoute = null;
  this.radius = 10;

  this.hasBeenHit = function (max) {
    const min = Math.floor(max * 0.8);
    const damage = this.randomNumber(min, max);
    this.annotations.push(new Annotation(this.x, this.y, `-${damage}`, 'orange', Date.now() + 500));
    this.health -= damage;
    if (this.health <= 0) {
      this.phase = DEAD;
      this.player.increaseXP(this.xp);
      this.levelComplete();
    }
  };

  this.render = function (context) {
    const animationPosition = `${this.animationAction}${this.animationFrame}`;
    const imageX = this.spriteData.frames[animationPosition].frame.x;
    const imageY = this.spriteData.frames[animationPosition].frame.y;
    const imageWidth = this.spriteData.frames[animationPosition].frame.w;
    const imageHeight = this.spriteData.frames[animationPosition].frame.h;
    const [centerX, centerY] = this.center();
    context.save();
    context.translate(centerX, centerY);
    context.rotate(this.rotation);
    context.drawImage(this.spriteSheet, imageX, imageY, imageWidth, imageHeight, -this.halfWidth, -this.halfHeight, imageWidth, imageHeight);
    context.restore();
    context.fillStyle = 'red';
    context.font = '12px Luckiest Guy';
    context.fillText('Boss', this.x, this.y);
  };
}

export default Boss;
