import Annotation from './Annotation';

const PATROL = 0;
const OBSERVE = 1;
const PURSUE = 3;
const ATTACK = 4;
const RESUME = 5;
const DEAD = 6;
const HIT = 7;
const STUNNED = 8;
const ATTACK_DELAY = 9;

function EnemyProto() {
  // A* route search

  this.findRoute = function (startIndex, stopIndex) {
    const closedSet = [];
    const destination = this.mapTiles[stopIndex];
    const tilesWithDistance = this
      .mapTiles
      .map((tile) => {
        tile.f = this.findDistanceBetweenTiles(tile.x, tile.y, destination.x, destination.y);
        tile.h = null;
        tile.g = null;
        tile.comingFrom = null;
        return tile;
      });
    const openSet = [startIndex];
    const route = [];
    while (openSet.length) {
      openSet.sort((a, b) => tilesWithDistance[a].f - tilesWithDistance[b].f);
      const current = openSet[0];
      if (current === stopIndex) {
        let comingFrom = tilesWithDistance[stopIndex].comingFrom;
        route.push(stopIndex);
        while (comingFrom) {
          route.unshift(comingFrom);
          comingFrom = tilesWithDistance[comingFrom].comingFrom;
        }
      }
      closedSet.push(current);
      openSet.shift();
      const neighbours = tilesWithDistance[current].neighbours;
      const legitimateNeighbour = [1, 3, 4, 6];
      neighbours.forEach((item, index) => {
        if (item && !closedSet.includes(item) && legitimateNeighbour.includes(index) && !tilesWithDistance[current].isObstacle) {
          const tentativeG = tilesWithDistance[current].g + 1;
          if (openSet.includes(item)) {
            if (tilesWithDistance[item].g > tentativeG) {
              tilesWithDistance[item].g = tentativeG;
              tilesWithDistance[item].cameFrom = current;
            }
          } else {
            openSet.push(item);
            tilesWithDistance[item].g = tentativeG;
            tilesWithDistance[item].comingFrom = current;
          }
          tilesWithDistance[item].f = tilesWithDistance[item].h + tilesWithDistance[item].g;
        }
      });
    }
    return route;
  };

  // Collision detection

  this.checkForCollision = function () {
    this.enemies.forEach((enemy) => {
      if (enemy !== this) {
        this.hitTestSprites(this, enemy);
      }
    });
  };

  // AI

  this.playerInRange = function () {
    if (this.findDistanceBetweenSprites(this, this.player) < this.mapTileSize * 5) {
      return true;
    }
    return false;
  };

  this.patrol = function () {
    if (this.phase !== PATROL) {
      this.resetActions();
      this.phase = PATROL;
    }
    this.animationFrame = Math.floor(this.animationCounter % 8);
    this.animationCounter += 0.1;
    const [centerX,
      centerY] = this.center();
    const currentIndex = this.getArrayIndex(centerX, centerY);
    if (currentIndex === this.patrolRoute.currentRoute[this.patrolRoute.routeIndex]) {
      this.advancePatrolIndex();
    }
    const route = this.patrolRoute.currentRoute;
    const routeIndex = this.patrolRoute.routeIndex;
    const targetIndex = route[routeIndex];
    const [targetX, targetY] = this.mapTiles[targetIndex].center;
    this.rotation = this.findAngle(centerX, centerY, targetX, targetY);
    this.x += Math.cos(this.rotation) * this.moveSpeed;
    this.y += Math.sin(this.rotation) * this.moveSpeed;
    this.checkForCollision();
    if (this.playerInRange()) {
      this.observe();
    }
  };

  this.advancePatrolIndex = function () {
    if (this.patrolRoute.routeIndex === this.patrolRoute.currentRoute.length - 1) {
      this.patrolRoute.routeIndex = 1;
      this.patrolRoute.route.reverse();
      this.patrolRoute.currentRoute = this.patrolRoute.route;
    } else {
      this.patrolRoute.routeIndex += 1;
    }
  };

  this.observe = function () {
    if (this.phase !== OBSERVE) {
      this.phase = OBSERVE;
      this.resetActions();
      this.actionEnd = Date.now() + 1000;
    }
    if (!this.playerInRange()) {
      this.patrol();
    } else if (this.actionEnd < Date.now()) {
      this.pursue();
    } else {
      this.facePlayer();
    }
  };

  this.pursue = function () {
    try {
      if (this.phase !== PURSUE) {
        this.resetActions();
        this.phase = PURSUE;
        this.pursueRoute = this.getRouteToPlayer();
        this.moveSpeed = 2;
      }
      if (!this.playerInRange()) {
        this.pursueRoute = null;
        this.resume();
      } else if (this.findDistanceBetweenSprites(this, this.player) < this.radius + 12) {
        this.pursueRoute = null;
        this.attack();
      } else {
        if (!this.pursueRoute || !this.pursueRoute.length) {
          this.pursueRoute = this.getRouteToPlayer();
        }
        const [centerX, centerY] = this.center();
        const currentIndex = this.getArrayIndex(centerX, centerY);
        const targetIndex = this.pursueRoute[0];
        const [targetX, targetY] = this.mapTiles[targetIndex].center;
        this.rotation = this.findAngle(centerX, centerY, targetX, targetY);
        this.x += Math.cos(this.rotation) * this.moveSpeed;
        this.y += Math.sin(this.rotation) * this.moveSpeed;
        this.checkForCollision();
        this.checkForWallCollision(this);
        this.animationFrame = Math.floor(this.animationCounter % 8);
        this.animationCounter += 8 / 30;
        if (currentIndex === this.pursueRoute[0]) {
          this.pursueRoute.shift();
        }
      }
    } catch (e) {
      console.log('error!', e, this);
    }
  };

  this.resume = function () {
    const [centerX, centerY] = this.center();
    const currentIndex = this.getArrayIndex(centerX, centerY);
    const endPoint = this.patrolRoute.route[this.patrolRoute.route.length - 1];
    this.patrolRoute.currentRoute = this.findRoute(currentIndex, endPoint);
    this.patrolRoute.routeIndex = 0;
    this.patrol();
  };

  this.attack = function () {
    if (this.phase !== ATTACK) {
      this.resetActions();
      this.phase = ATTACK;
      this.animationAction = this.attackAnimation;
      this.actionEnd = Date.now() + 1000;
    }
    if (this.actionEnd < Date.now()) {
      if (this.findDistanceBetweenSprites(this, this.player) > this.radius + 12) {
        this.pursue();
      } else {
        this.facePlayer();
        this.player.reduceHealth(this.damage);
        this.attackDelay();
      }
    } else {
      this.animationCounter += 8 / 60;
      this.animationFrame = Math.floor(this.animationCounter % 8);
    }
  };

  this.attackDelay = function () {
    if (this.phase !== ATTACK_DELAY) {
      this.resetActions();
      this.phase = ATTACK_DELAY;
      this.actionEnd = Date.now() + 2000;
    }
    const distanceToPlayer = this.findDistanceBetweenSprites(this, this.player);
    if (distanceToPlayer > this.radius + 12) {
      this.pursue();
    } else if (Date.now() > this.actionEnd) {
      this.attack();
    }
  };

  this.hasBeenStunned = function () {
    if (this.phase !== STUNNED) {
      this.resetActions();
      this.phase = STUNNED;
      this.animationAction = this.stunnedAnimation;
      this.actionEnd = Date.now() + 3000;
    }
    if (Date.now() < this.actionEnd) {
      this.animationCounter += 8 / 30;
      this.animationFrame = Math.floor(this.animationCounter % 8);
    } else {
      this.attack();
    }
  };

  this.hasBeenHit = function (max) {
    const min = Math.floor(max * 0.8);
    const damage = this.randomNumber(min, max);
    this.annotations.push(new Annotation(this.x, this.y, `-${damage}`, 'orange', Date.now() + 500));
    this.health -= damage;
    if (this.health <= 0) {
      this.phase = DEAD;
      this.player.increaseXP(this.xp);
    }
  };

  // Misc

  this.center = function () {
    return [this.x + this.halfWidth, this.y + this.halfHeight,
    ];
  };

  this.facePlayer = function () {
    const [playerX, playerY] = this.player.center();
    const [centerX, centerY] = this.center();
    this.rotation = this.findAngle(centerX, centerY, playerX, playerY);
  };

  this.getRouteToPlayer = function () {
    const [playerX, playerY] = this.player.center();
    const [centerX, centerY] = this.center();
    const playerIndex = this.getArrayIndex(playerX, playerY);
    const enemyIndex = this.getArrayIndex(centerX, centerY);
    const pursueRoute = this.findRoute(enemyIndex, playerIndex);
    return pursueRoute;
  };

  this.resetActions = function () {
    this.actionEnd = null;
    this.animationAction = this.walkAnimation;
    this.animationFrame = 0;
    this.animationCounter = 0;
    this.moveSpeed = 0.5;
  };

  // Update and render

  this.update = function () {
    switch (this.phase) {
      case HIT:
        this.hasBeenHit();
        break;
      case PATROL:
        this.patrol();
        break;
      case OBSERVE:
        this.observe();
        break;
      case PURSUE:
        this.pursue();
        break;
      case ATTACK:
        this.attack();
        break;
      case RESUME:
        this.resume();
        break;
      case STUNNED:
        this.hasBeenStunned();
        break;
      case ATTACK_DELAY:
        this.attackDelay();
        break;
      default:
        this.patrol();
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
  };
}

export default EnemyProto;
