import { WALL, VOID, FLOOR } from './tileConstants';
import MapTile from './MapTile';
import Room from './Room';
import Corridor from './Corridor';
import EnemyProto from './EnemyProto';
import Enemy from './Enemy';
import Boss from './Boss';
import Player from './Player';
import Exit from './Exit';
import Key from './Key';
import Potion from './Potion';
import Weapon from './Weapon';
import levelConfig from './levelConfig';

function LevelMap(currentLevel, spriteSheet, spriteData) {
  this.currentLevel = currentLevel;
  this.mapTiles = [];
  this.rooms = [];
  this.corridors = [];
  this.enemies = [];
  this.player = null;
  this.gameCanvas = null;
  this.mapRows = levelConfig.mapRows;
  this.mapColumns = levelConfig.mapColumns;
  this.mapWidth = levelConfig.mapWidth;
  this.mapHeight = levelConfig.mapHeight;
  this.roomCount = levelConfig.level[currentLevel].rooms;
  this.enemyCount = levelConfig.level[currentLevel].enemies;
  this.spriteSheet = spriteSheet;
  this.spriteData = spriteData;
  this.mapTileSize = levelConfig.mapTileSize;
  this.halfWidth = levelConfig.mapTileSize / 2;
  this.halfHeight = levelConfig.mapTileSize / 2;
  this.spriteTileSize = 32;
  this.camPanX = 0;
  this.camPanY = 0;
  this.levelCompleted = false;
  this.annotations = [];

  this.getTopLeftNeighbour = function (col, row) {
    const neighbourCol = col - 1;
    const neighbourRow = row - 1;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getTopMiddleNeighbour = function (col, row) {
    const neighbourCol = col;
    const neighbourRow = row - 1;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getTopRightNeighbour = function (col, row) {
    const neighbourCol = col + 1;
    const neighbourRow = row - 1;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getLeftNeighbour = function (col, row) {
    const neighbourCol = col - 1;
    const neighbourRow = row;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getRightNeighbour = function (col, row) {
    const neighbourCol = col + 1;
    const neighbourRow = row;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getBottomLeftNeighbour = function (col, row) {
    const neighbourCol = col - 1;
    const neighbourRow = row + 1;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getBottomMiddleNeighbour = function (col, row) {
    const neighbourCol = col;
    const neighbourRow = row + 1;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.getBottomRightNeighbour = function (col, row) {
    const neighbourCol = col + 1;
    const neighbourRow = row + 1;
    if (neighbourCol >= 0 && neighbourCol < this.mapColumns) {
      if (neighbourRow >= 0 && neighbourRow < this.mapRows) {
        return neighbourCol + (this.mapColumns * neighbourRow);
      }
    }
    return null;
  };

  this.generateRoomsAndCorridors = () => {
    for (let i = 0; i < this.roomCount; i += 1) {
      const entrance = i === 0
        ? [null, null]
        : this.corridors[i - 1].exit;
      const room = new Room(entrance);
      Object.setPrototypeOf(room, this);
      room.generateMapIndexes();
      this
        .rooms
        .push(room);
      if (this.corridors.length < this.roomCount - 1) {
        const corridor = new Corridor(this.rooms[i].exit);
        Object.setPrototypeOf(corridor, this);
        corridor.generateMapIndexes();
        this
          .corridors
          .push(corridor);
      }
    }
  };

  this.fillMapTilesWithRooms = () => {
    for (let i = 0; i < this.rooms.length; i += 1) {
      const room = this.rooms[i];
      for (let mapIndex = 0; mapIndex < room.mapIndexes.length; mapIndex += 1) {
        const tilePosition = room.mapIndexes[mapIndex];
        const tileIndex = this.findArrayIndex(tilePosition[0], tilePosition[1]);
        this.mapTiles[tileIndex].tileType = FLOOR;
        this.mapTiles[tileIndex].isObstacle = false;
        const tileImageNumber = this.randomNumber(1, 5);
        const tileImage = `floorTile${tileImageNumber}`;
        this.mapTiles[tileIndex].spriteSheetX = this.spriteData.frames[tileImage].frame.x;
        this.mapTiles[tileIndex].spriteSheetY = this.spriteData.frames[tileImage].frame.y;
      }
    }
  };

  this.fillMapTilesWithCorridors = () => {
    for (let i = 0; i < this.corridors.length; i += 1) {
      const corridor = this.corridors[i];
      for (let mapIndex = 0; mapIndex < corridor.mapIndexes.length; mapIndex += 1) {
        const tilePosition = corridor.mapIndexes[mapIndex];
        const tileIndex = this.findArrayIndex(tilePosition[0], tilePosition[1]);
        this.mapTiles[tileIndex].tileType = FLOOR;
        this.mapTiles[tileIndex].isObstacle = false;
        const tileImageNumber = this.randomNumber(1, 5);
        const tileImage = `floorTile${tileImageNumber}`;
        this.mapTiles[tileIndex].spriteSheetX = this.spriteData.frames[tileImage].frame.x;
        this.mapTiles[tileIndex].spriteSheetY = this.spriteData.frames[tileImage].frame.y;
      }
    }
  };

  this.generateBlankArray = () => {
    const arrLength = this.mapRows * this.mapColumns;
    for (let index = 0; index < arrLength; index += 1) {
      const row = Math.floor(index / this.mapColumns);
      const column = Math.floor(index % this.mapColumns);
      const x = column * this.mapTileSize;
      const y = row * this.mapTileSize;
      const tileType = WALL;
      const neighbours = [
        this.getTopLeftNeighbour(column, row),
        this.getTopMiddleNeighbour(column, row),
        this.getTopRightNeighbour(column, row),
        this.getLeftNeighbour(column, row),
        this.getRightNeighbour(column, row),
        this.getBottomLeftNeighbour(column, row),
        this.getBottomMiddleNeighbour(column, row),
        this.getBottomRightNeighbour(column, row)
      ];
      const xCenter = x + (this.mapTileSize / 2);
      const yCenter = y + (this.mapTileSize / 2);
      const center = [xCenter, yCenter];
      const isObstacle = true;
      const tileImageNumber = this.randomNumber(1, 5);
      const wallImage = `wall${tileImageNumber}`;
      const spriteSheetX = this.spriteData.frames[wallImage].frame.x;
      const spriteSheetY = this.spriteData.frames[wallImage].frame.y;
      const left = x;
      const top = y;
      const bottom = y + this.mapTileSize;
      const right = x + this.mapTileSize;
      const tile = new MapTile(index, x, y, row, column, tileType, neighbours, center, isObstacle, spriteSheetX, spriteSheetY, left, top, bottom, right);
      Object.setPrototypeOf(tile, this);
      this
        .mapTiles
        .push(tile);
    }
  };

  this.hitTestSpriteMapTileSide = function (sprite, mapTile) {
    const [spriteX,
      spriteY] = sprite.center();
    const mapTileHalfWidth = this.mapTileSize / 2;
    const mapTileHalfHeight = this.mapTileSize / 2;
    const vx = (spriteX) - (mapTile.x + mapTileHalfWidth);
    const vy = (spriteY) - (mapTile.y + mapTileHalfHeight);
    const combinedHalfWidths = sprite.radius + mapTileHalfWidth;
    const combinedHalfHeights = sprite.radius + mapTileHalfHeight;
    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        const overlapX = combinedHalfWidths - Math.abs(vx);
        const overlapY = combinedHalfHeights - Math.abs(vy);
        if (overlapX >= overlapY) {
          if (vy > 0) {
            sprite.y += overlapY;
          } else {
            sprite.y -= overlapY;
          }
        } else if (vx > 0) {
          sprite.x += overlapX;
        } else {
          sprite.x -= overlapX;
        }
      }
    }
  };

  this.hitTestSpriteMapTilePoint = function (sprite, point) {
    const [spriteX,
      spriteY] = sprite.center();
    const vx = point.x - (spriteX);
    const vy = point.y - (spriteY);
    const magnitude = Math.sqrt((vx * vx) + (vy * vy));
    if (magnitude < sprite.radius) {
      const overlap = sprite.radius - magnitude;
      const dx = vx / magnitude;
      const dy = vy / magnitude;
      sprite.x -= overlap * dx;
      sprite.y -= overlap * dy;
    }
  };

  this.hitTestSprites = function (c1, c2) {
    const vx = (c2.x + c2.radius) - (c1.x + c1.radius);
    const vy = (c2.y + c2.radius) - (c1.y + c1.radius);
    const magnitude = Math.sqrt((vx * vx) + (vy * vy));
    const combinedRadii = c1.radius + c2.radius;
    if (magnitude < combinedRadii) {
      let overlap = combinedRadii - magnitude;
      const padding = 0.3;
      overlap += padding;
      const dx = vx / magnitude;
      const dy = vy / magnitude;
      c1.x -= overlap * dx;
      c1.y -= overlap * dy;
    }
  };

  this.hitTestSpriteMapTile = function (sprite, mapTile) {
    const [spriteX,
      spriteY] = sprite.center();
    const mapTileX = mapTile.x;
    const mapTileY = mapTile.y;
    let region;
    if (spriteX < mapTileX && spriteY < mapTileY) {
      region = 'topLeft';
    }
    if (spriteX > mapTileX && spriteY < mapTileY) {
      region = 'topMiddle';
    }
    if (spriteX > (mapTileX + this.mapTileSize) && spriteY < mapTileY) {
      region = 'topRight';
    }
    if (spriteX < mapTileX && spriteY > mapTileY && spriteY < (mapTileY + this.mapTileSize)) {
      region = 'leftMiddle';
    }
    if (spriteX > (mapTileX + this.mapTileSize) && spriteY > mapTileY && spriteY < (mapTileY + this.mapTileSize)) {
      region = 'rightMiddle';
    }
    if (spriteX < mapTileX && spriteY > (mapTileY + this.mapTileSize)) {
      region = 'bottomLeft';
    }
    if (spriteX > mapTileX && spriteX < (mapTileX + this.mapTileSize) && spriteY > (mapTileY + this.mapTileSize)) {
      region = 'bottomMiddle';
    }
    if (spriteX > (mapTileX + this.mapTileSize) && spriteY > (mapTileY + this.mapTileSize)) {
      region = 'bottomRight';
    }
    if (region === 'topMiddle' || region === 'bottomMiddle' || region === 'leftMiddle' || region === 'rightMiddle') {
      this.hitTestSpriteMapTileSide(sprite, mapTile);
    } else {
      const point = {};
      switch (region) {
        case 'topLeft':
          point.x = mapTileX;
          point.y = mapTileY;
          break;
        case 'topRight':
          point.x = mapTileX + this.mapTileSize;
          point.y = mapTileY;
          break;
        case 'bottomLeft':
          point.x = mapTileX;
          point.y = mapTileY + this.mapTileSize;
          break;
        case 'bottomRight':
          point.x = mapTileX + this.mapTileSize;
          point.y = mapTileY + this.mapTileSize;
          break;
        default:
          break;
      }
      this.hitTestSpriteMapTilePoint(sprite, point);
    }
  };

  this.checkForWallCollision = function (sprite) {
    const [spriteX,
      spriteY] = sprite.center();
    const currentTile = this.mapTiles[this.getArrayIndex(spriteX, spriteY)];
    for (let i = 0; i < currentTile.neighbours.length; i += 1) {
      if (currentTile.neighbours[i] && this.mapTiles[currentTile.neighbours[i]].isObstacle) {
        this.hitTestSpriteMapTile(sprite, this.mapTiles[currentTile.neighbours[i]]);
      }
    }
  };

  this.hasFloorNeighbour = function (tile) {
    let hasFloorNeighbour = false;
    for (let i = 0; i < tile.neighbours.length; i += 1) {
      const tileIndex = tile.neighbours[i];
      if (tileIndex && this.mapTiles[tileIndex].tileType === FLOOR) {
        hasFloorNeighbour = true;
        break;
      }
    }
    return hasFloorNeighbour;
  };

  this.removeWalls = function () {
    this
      .mapTiles
      .forEach((tile) => {
        if (tile.tileType === WALL && !this.hasFloorNeighbour(tile)) {
          tile.tileType = VOID;
        }
      });
  };

  this.randomFloorTile = function (floorTiles) {
    const randomTile = this.randomNumber(0, floorTiles.length - 1);
    const index = floorTiles[randomTile].index;
    floorTiles.splice(randomTile, 1);
    const farAwayTile = floorTiles[(Math.floor(randomTile + (floorTiles.length / 2))) % floorTiles.length].index;
    floorTiles.splice(farAwayTile, 1);
    return [index, farAwayTile];
  };

  this.generatePlayer = (playerLevel, playerHealth, playerMaxHealth, playerDamage, playerWeapon, playerXP) => {
    const player = new Player(playerLevel, playerHealth, playerMaxHealth, playerDamage, playerWeapon, playerXP);
    Object.setPrototypeOf(player, this);
    const [row,
      column] = this.findMapCenter();
    player.x = row * 32;
    player.y = column * 32;
    this.player = player;
  };

  this.createRoute = function (enemy, floorTiles) {
    const [startTile,
      stopTile] = this.randomFloorTile(floorTiles);
    enemy.routeStart = startTile;
    enemy.routeStop = stopTile;
    enemy.x = this.mapTiles[startTile].x;
    enemy.y = this.mapTiles[startTile].y;
    const path = enemy.findRoute(startTile, stopTile);
    enemy.patrolRoute = {
      route: path,
      routeIndex: 0,
      currentRoute: path
    };
  };

  this.generateEnemies = function (floorTiles) {
    const enemyProto = new EnemyProto();
    Object.setPrototypeOf(enemyProto, this);
    for (let i = 0; i < this.enemyCount; i += 1) {
      const enemy = new Enemy();
      Object.setPrototypeOf(enemy, enemyProto);
      this.createRoute(enemy, floorTiles);
      enemy.health = levelConfig.level[this.currentLevel].enemyHealth;
      enemy.damage = levelConfig.level[this.currentLevel].enemyDamage;
      enemy.xp = levelConfig.level[this.currentLevel].enemyXP;
      this.enemies.push(enemy);
    }
    if (this.currentLevel === 5) {
      const boss = new Boss();
      Object.setPrototypeOf(boss, enemyProto);
      this.createRoute(boss, floorTiles);
      boss.health = levelConfig.bossStats.bossHealth;
      boss.damage = levelConfig.bossStats.bossDamage;
      boss.xp = levelConfig.bossStats.bossXP;
      this.enemies.push(boss);
    }
  };

  this.generateExit = function (floorTiles) {
    const [exitTile,
      keyTile] = this.randomFloorTile(floorTiles);
    const exit = new Exit(this.mapTiles[exitTile].x, this.mapTiles[exitTile].y);
    Object.setPrototypeOf(exit, this);
    this.exit = exit;
    const key = new Key(this.mapTiles[keyTile].x, this.mapTiles[keyTile].y);
    Object.setPrototypeOf(key, this);
    this.key = key;
  };

  this.generatePotion = function (floorTiles) {
    const [potionTile] = this.randomFloorTile(floorTiles);
    const potion = new Potion(this.mapTiles[potionTile].x, this.mapTiles[potionTile].y);
    Object.setPrototypeOf(potion, this);
    this.potion = potion;
  };

  this.generateWeapon = function (floorTiles) {
    const [weaponTile] = this.randomFloorTile(floorTiles);
    const weapon = new Weapon(this.mapTiles[weaponTile].x, this.mapTiles[weaponTile].y, levelConfig.level[this.currentLevel].weapon);
    Object.setPrototypeOf(weapon, this);
    this.weapon = weapon;
  };

  this.initializeMap = () => {
    this.generateBlankArray();
    this.generateRoomsAndCorridors();
    this.fillMapTilesWithRooms();
    this.fillMapTilesWithCorridors();
    this.removeWalls();
    const availableTiles = this
      .mapTiles
      .filter((tile) => tile.tileType === FLOOR);
    this.generateEnemies(availableTiles);
    this.generatePotion(availableTiles);
    this.generateWeapon(availableTiles);
    if (this.currentLevel < 5) {
      this.generateExit(availableTiles);
    }
  };

  this.drawAll = (context) => {
    context.imageSmoothingEnabled = true;
    const currentPlayerIndex = this.getArrayIndex(this.player.x, this.player.y);
    const [currentRow, currentCol] = this.findRowCol(currentPlayerIndex);
    const mapRenderColStart = currentCol - 13 < 0 ? 0 : currentCol - 13;
    const mapRenderColStop = currentCol + 13 >= this.mapColumns - 1 ? this.mapColumns - 1 : currentCol + 13;
    const mapRenderRowStart = currentRow - 11 < 0 ? 0 : currentRow - 11;
    const mapRenderRowStop = currentRow + 11 > this.mapRows - 1 ? this.mapRows - 1 : currentRow + 11;
    this.clearCanvas(context);
    context.save();
    const x = this.player.x - (this.mapWidth / 2);
    const y = this.player.y - (this.mapHeight / 2);
    context.translate(-x, -y);
    for (let c = mapRenderColStart; c <= mapRenderColStop; c += 1) {
      for (let r = mapRenderRowStart; r <= mapRenderRowStop; r += 1) {
        const tile = this.mapTiles[this.findArrayIndex(r, c)];
        if (tile.tileType !== VOID) {
          this.renderTiles(context, tile);
        }
      }
    }
    if (this.currentLevel < 5) {
      this.exit.render(context);
      this.key.render(context);
    }
    this.potion.render(context);
    this.weapon.render(context);
    for (let i = 0; i < this.enemies.length; i += 1) {
      this.enemies[i].render(context);
    }
    for (let i = 0; i < this.annotations.length; i += 1) {
      if (this.annotations[i].active) {
        this.annotations[i].render(context);
      }
    }
    this.player.render(context);
    context.restore();
  };

  this.updateAll = () => {
    for (let i = 0; i < this.enemies.length; i += 1) {
      this.enemies[i].update(0, 0);
    }
    for (let i = 0; i < this.annotations.length; i += 1) {
      if (this.annotations[i].active) {
        this.annotations[i].update();
      }
    }
    this.player.update();
    this.potion.update();
    this.weapon.update();
    if (this.currentLevel < 5) {
      this.exit.update();
      this.key.update();
    }
    this.cleanUp();
  };

  this.cleanUp = function () {
    this.enemies = this.enemies.filter((enemy) => enemy.phase !== 6);
    this.annotations = this.annotations.filter((annotation) => annotation.active);
  };

  this.getCenter = function (x, y) {
    return [
      x + (this.mapTileSize / 2),
      y + (this.mapTileSize / 2),
    ];
  };

  this.findArrayIndex = (row, column) => column + (this.mapColumns * row);

  this.randomNumber = (min, max) => Math.floor((Math.random() * ((max - min) + 1)) + min);

  this.findRowCol = (index) => {
    const col = Math.floor(index % this.mapColumns);
    const row = Math.floor(index / this.mapColumns);
    return [row, col];
  };

  this.findDistanceBetweenTiles = (x1, x2, y1, y2) => {
    const x = (x2 - x1) * (x2 - x1);
    const y = (y2 - y1) * (y2 - y1);
    return Math.sqrt(x + y);
  };

  this.findDistanceBetweenSprites = function (spriteA, spriteB) {
    const [spriteAX,
      spriteAY] = spriteA.center();
    const [spriteBX,
      spriteBY] = spriteB.center();
    const vx = spriteBX - spriteAX;
    const vy = spriteBY - spriteAY;
    const magnitude = Math.sqrt((vx * vx) + (vy * vy));
    return Math.abs(magnitude);
  };

  this.getArrayIndex = function (x, y) {
    const colIndex = Math.floor(x / this.mapTileSize);
    const rowIndex = Math.floor(y / this.mapTileSize);
    return colIndex + (this.mapColumns * rowIndex);
  };

  this.findMapCenter = function () {
    const startRow = Math.floor(this.mapRows / 2);
    const startColumn = Math.floor(this.mapColumns / 2);
    return [startRow, startColumn];
  };

  this.findAngle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);

  this.clearCanvas = function (context) {
    context.fillStyle = '#1a1b19';
    context.fillRect(0, 0, this.mapWidth, this.mapHeight);
  };

  this.renderTiles = function (context, tile) {
    context.drawImage(this.spriteSheet, tile.spriteSheetX, tile.spriteSheetY, this.mapTileSize, this.mapTileSize, tile.x, tile.y, this.mapTileSize, this.mapTileSize);
  };

  this.levelComplete = function () {
    if (this.hasOwnProperty('levelCompleted')) {
      this.levelCompleted = true;
    } else {
      const proto = Object.getPrototypeOf(this);
      proto.levelComplete();
    }
  };
}
export default LevelMap;
