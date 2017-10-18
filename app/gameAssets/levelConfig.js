const levelConfig = {
  mapWidth: 800,
  mapHeight: 640,
  mapTileSize: 32,
  mapRows: 64,
  mapColumns: 64,
  level: {
    1: {
      rooms: 6,
      enemies: 10,
      enemyHealth: 30,
      enemyDamage: 10,
      enemyXP: 10,
      weapon: 10,
    },
    2: {
      rooms: 8,
      enemies: 12,
      enemyHealth: 60,
      enemyDamage: 20,
      enemyXP: 20,
      weapon: 10,
    },
    3: {
      rooms: 10,
      enemies: 14,
      enemyHealth: 120,
      enemyDamage: 30,
      enemyXP: 30,
      weapon: 10,
    },
    4: {
      rooms: 12,
      enemies: 16,
      enemyHealth: 240,
      enemyDamage: 40,
      enemyXP: 40,
      weapon: 10,
    },
    5: {
      rooms: 14,
      enemies: 18,
      enemyHealth: 480,
      enemyDamage: 50,
      enemyXP: 50,
      weapon: 10,
    },
  },
  bossStats: {
    bossHealth: 3000,
    bossDamage: 100,
    bossXP: 1000,
  },
  playerStats: {
    1: {
      health: 100,
      nextLevel: 80,
      damage: 10,
    },
    2: {
      health: 150,
      nextLevel: 220,
      damage: 20,
    },
    3: {
      health: 200,
      nextLevel: 480,
      damage: 40,
    },
    4: {
      health: 250,
      nextLevel: 720,
      damage: 80,
    },
    5: {
      health: 300,
      nextLevel: 1000000000,
      damage: 160,
    },
  },
};

export default levelConfig;
