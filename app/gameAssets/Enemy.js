const PATROL = 0;

function Enemy() {
  this.x = null;
  this.y = null;
  this.routeStart = null;
  this.routeStop = null;
  this.moveSpeed = 0.5;
  this.rotation = 0;
  this.phase = PATROL;
  this.animationCounter = 0;
  this.walkAnimation = 'monsterWalk_00';
  this.attackAnimation = 'monsterAttack_00';
  this.stunnedAnimation = 'monsterHit_00';
  this.animationAction = this.walkAnimation;
  this.animationFrame = 0;
  this.actionEnd = 0;
  this.patrolRoute = null;
  this.pursueRoute = null;
  this.radius = 10;
}

export default Enemy;
