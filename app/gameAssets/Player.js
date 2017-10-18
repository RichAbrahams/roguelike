import Annotation from './Annotation';
import levelConfig from './levelConfig';

function Player(playerLevel, playerWeapon, playerXP) {
  this.moveUp = false;
  this.moveDown = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.moveTo = null;
  this.actionEnd = null;
  this.attacking = false;
  this.attackAnimation = 1;
  this.blocking = false;
  this.animationAction = 'playerRun_00';
  this.moveSpeed = 2;
  this.radius = 10;
  this.x = null;
  this.y = null;
  this.rotation = 0;
  this.animationCounter = 5;
  this.animationFrame = 0;
  this.center = [];
  this.level = playerLevel;
  this.health = levelConfig.playerStats[playerLevel].health;
  this.maxHealth = levelConfig.playerStats[playerLevel].health;
  this.damage = levelConfig.playerStats[playerLevel].damage;
  this.weapon = playerWeapon;
  this.xp = playerXP;
  this.nextLevel = levelConfig.playerStats[playerLevel].nextLevel;

  this.center = function () {
    return [
      this.x + this.halfWidth,
      this.y + this.halfHeight,
    ];
  };

  this.reduceHealth = function (max) {
    const min = Math.floor(max * 0.8);
    const damage = this.randomNumber(min, max);
    this.health -= damage;
    this
      .annotations
      .push(new Annotation(this.x, this.y, `-${damage}`, 'red', Date.now() + 1000));
  };

  this.increaseXP = function (xpGained) {
    this.xp += xpGained;
    this
    .annotations
    .push(new Annotation(this.x, this.y, `+${xpGained} XP`, 'Chartreuse', Date.now() + 750));
  };

  this.movePlayer = function () {
    this.animationAction = 'playerRun_00';
    if (this.moveUp) {
      this.animationCounter += 0.2;
      this.y -= this.moveSpeed;
    }
    if (this.moveDown) {
      this.animationCounter += 0.2;
      this.y += this.moveSpeed;
    }
    if (this.moveLeft) {
      this.animationCounter += 0.2;
      this.x -= this.moveSpeed;
    }
    if (this.moveRight) {
      this.animationCounter += 0.2;
      this.x += this.moveSpeed;
    }
  };

  this.rotatePlayer = function () {
    if (this.moveUp && this.moveRight) {
      this.rotation = 5.49779;
      return;
    }
    if (this.moveUp && this.moveLeft) {
      this.rotation = 3.92699;
      return;
    }
    if (this.moveDown && this.moveRight) {
      this.rotation = 0.785398;
      return;
    }
    if (this.moveDown && this.moveLeft) {
      this.rotation = 2.35619;
      return;
    }
    if (this.moveUp) {
      this.rotation = 4.71239;
      return;
    }
    if (this.moveRight) {
      this.rotation = 0;
      return;
    }
    if (this.moveDown) {
      this.rotation = 1.5708;
      return;
    }
    if (this.moveLeft) {
      this.rotation = 3.14159;
      return;
    }
  };

  this.enemyHitTest = function (enemy) {
    const [centerX, centerY] = this.center();
    const [enemyX, enemyY] = enemy.center();
    const vx = enemyX - centerX;
    const vy = enemyY - centerY;
    const magnitude = Math.sqrt((vx * vx) + (vy * vy));
    const angle = Math.atan2(vy, vx);
    const positiveRotation = this.rotation < 0 ? 3.14159 + (3.14159 + this.rotation) : this.rotation;
    const posistiveAngle = angle < 0 ? 3.14159 + (3.14159 + angle) : angle;
    const phi = Math.abs(posistiveAngle - positiveRotation) % 6.28319;
    const distance = phi > 3.14159 ? 6.28319 - phi : phi;
    if (magnitude < this.radius * 3 && distance > -1.39626 && distance < 1.39626) {
      return true;
    }
    return false;
  };

  this.checkEnemyHit = function () {
    this.enemies.forEach((enemy) => {
      if (this.enemyHitTest(enemy)) {
        enemy.hasBeenHit(this.damage + this.weapon);
      }
    });
  };

  this.checkEnemyStunned = function () {
    this.enemies.forEach((enemy) => {
      if (this.enemyHitTest(enemy)) {
        enemy.hasBeenStunned();
      }
    });
  };

  this.attack = function () {
    if (!this.actionEnd) {
      this.actionEnd = Date.now() + 500;
      this.animationAction = `playerAttack${this.attackAnimation}_00`;
      this.animationFrame = 0;
      this.animationCounter = 0;
    }
    if (this.actionEnd <= Date.now()) {
      this.attackAnimation = this.attackAnimation === 1 ? 2 : 1;
      this.attacking = false;
      this.animationFrame = 0;
      this.animationCounter = 0;
      this.animationAction = 'playerRun_00';
      this.actionEnd = null;
      this.checkEnemyHit();
    } else {
      this.animationCounter += 8 / 30;
      this.animationFrame = Math.floor(this.animationCounter % 8);
    }
  };

  this.block = function () {
    if (!this.actionEnd) {
      this.actionEnd = Date.now() + 1000;
      this.animationFrame = 0;
      this.animationCounter = 0;
      this.animationAction = 'playerBlock_00';
    }
    if (this.actionEnd < Date.now()) {
      this.blocking = false;
      this.animationFrame = 0;
      this.animationCounter = 0;
      this.animationAction = 'playerRun_00';
      this.actionEnd = null;
      this.checkEnemyStunned();
    } else {
      this.animationCounter += 8 / 60;
      this.animationFrame = Math.floor(this.animationCounter % 8);
    }
  };

  this.resetActions = function () {
    this.actionEnd = Date.now() + 1000;
    this.animationFrame = 0;
    this.animationCounter = 0;
  };

  this.checkEnemyCollision = function () {
    this
      .enemies
      .forEach((enemy) => {
        this.hitTestSprites(this, enemy);
      });
  };

  this.setMoveTo = function (x, y) {
    this.moveTo = {
      x: x + (this.x - (this.mapWidth / 2)),
      y: y + (this.y - (this.mapHeight / 2)),
    };
  };

  this.mouseMove = function () {
    this.animationAction = 'playerRun_00';
    const [centerX,
      centerY] = this.center();
    const distance = this.findDistanceBetweenTiles(centerX, this.moveTo.x, centerY, this.moveTo.y);
    if (distance > 1) {
      this.rotation = this.findAngle(centerX, centerY, this.moveTo.x, this.moveTo.y);
      this.x += Math.cos(this.rotation) * this.moveSpeed;
      this.y += Math.sin(this.rotation) * this.moveSpeed;
    } else {
      this.x = this.moveTo.x - (this.mapTileSize / 2);
      this.y = this.moveTo.y - (this.mapTileSize / 2);
      this.moveTo = null;
    }
    this.animationFrame = Math.floor(this.animationCounter % 8);
    this.animationCounter += 0.3;
  };

  this.move = function () {
    this.animationFrame = Math.floor(this.animationCounter % 8);
    if (this.moveTo) {
      this.mouseMove();
    } else {
      this.rotatePlayer();
      this.movePlayer();
    }
    this.checkForWallCollision(this);
    this.checkEnemyCollision();
  };

  this.levelUp = function () {
    this.level += 1;
    this.xp = this.xp - this.nextLevel;
    this.health = levelConfig.playerStats[this.level].health;
    this.maxHealth = levelConfig.playerStats[this.level].health;
    this.damage = levelConfig.playerStats[this.level].damage;
    this.nextLevel = levelConfig.playerStats[this.level].nextLevel;
    this.annotations.push(new Annotation(this.x, this.y - 20, 'Level Up', 'gold', Date.now() + 1000));
  };

  this.update = function () {
    if (this.blocking) {
      this.block();
    } else if (this.attacking) {
      this.attack();
    } else {
      this.move();
    }
    if (this.xp >= this.nextLevel) {
      this.levelUp();
    }
  };

  this.render = function (context) {
    const animationPosition = `${this.animationAction}${this.animationFrame}`;
    const imageX = this.spriteData.frames[animationPosition].frame.x;
    const imageY = this.spriteData.frames[animationPosition].frame.y;
    const imageWidth = this.spriteData.frames[animationPosition].frame.w;
    const imageHeight = this.spriteData.frames[animationPosition].frame.h;
    const [centerX,
      centerY] = this.center();
    context.save();
    context.translate(centerX, centerY);
    context.rotate(this.rotation);
    context.drawImage(this.spriteSheet, imageX, imageY, imageWidth, imageHeight, -this.halfWidth, -this.halfHeight, imageWidth, imageHeight);
    context.restore();
  };
}

export default Player;
