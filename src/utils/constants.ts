import { GameConfig } from '@/types';

/**
 * 默认游戏配置
 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  canvas: {
    width: 800,
    height: 600,
  },
  player: {
    speed: 200, // 像素/秒
    size: { x: 48, y: 48 }, // 更新为新的飞船尺寸
    shootCooldown: 200, // 毫秒
    startPosition: { x: 376, y: 540 }, // 调整位置以适应新尺寸
  },
  enemy: {
    baseSpeed: 50, // 像素/秒
    size: { x: 48, y: 48 },
    spawnRate: 2000, // 毫秒
    shootInterval: 3000, // 毫秒
  },
  bullet: {
    speed: 300, // 像素/秒
    size: { x: 4, y: 8 },
  },
  difficulty: {
    speedIncreaseRate: 1.1, // 每次增加10%
    maxSpeed: 100, // 最大速度
    enemySpawnIncreaseRate: 0.9, // 生成间隔减少10%
    timeInterval: 30000, // 每30秒增加难度
  },
  game: {
    initialLives: 3,
    targetFPS: 60,
  },
};

/**
 * 游戏颜色常量
 */
export const COLORS = {
  BACKGROUND: '#000011',
  PLAYER: '#00ff00',
  ENEMY: '#ff0000',
  PLAYER_BULLET: '#ffff00',
  ENEMY_BULLET: '#ff8800',
  UI_TEXT: '#ffffff',
  UI_ACCENT: '#00ffff',
} as const;

/**
 * 键盘按键常量
 */
export const KEYS = {
  W: 'KeyW',
  A: 'KeyA',
  S: 'KeyS',
  D: 'KeyD',
  J: 'KeyJ', // 普通射击键
  SPACE: 'Space',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  K: 'KeyK', // 导弹发射键
} as const;

/**
 * 游戏事件常量
 */
export const GAME_EVENTS = {
  ENEMY_DESTROYED: 'ENEMY_DESTROYED',
  PLAYER_HIT: 'PLAYER_HIT',
  BULLET_FIRED: 'BULLET_FIRED',
  GAME_OVER: 'GAME_OVER',
  LEVEL_UP: 'LEVEL_UP',
} as const;

/**
 * 得分常量
 */
export const SCORING = {
  ENEMY_KILL: 100,
  BONUS_MULTIPLIER: 1.5,
} as const;

/**
 * 敌人类型配置
 */
export const ENEMY_TYPES = {
  BASIC: {
    id: 'basic',
    size: { x: 48, y: 48 },
    shootInterval: 3000,
    bulletType: 'normal',
    shootPattern: 'straight',
    spawnWeight: 50, // 生成权重
    health: 1,
    scoreValue: 100,
    speedMultiplier: 1.0,
    minScore: 0, // 最低分数要求
  },
  DIAGONAL: {
    id: 'diagonal',
    size: { x: 56, y: 56 },
    shootInterval: 2500,
    bulletType: 'normal',
    shootPattern: 'diagonal',
    spawnWeight: 30,
    health: 1,
    scoreValue: 100,
    speedMultiplier: 1.0,
    minScore: 0,
  },
  LASER: {
    id: 'laser',
    size: { x: 64, y: 64 },
    shootInterval: 8000, // 大幅增加发射间隔
    bulletType: 'laser',
    shootPattern: 'straight',
    spawnWeight: 20,
    health: 1,
    scoreValue: 100,
    speedMultiplier: 1.0,
    minScore: 0,
  },
  ELITE: {
    id: 'elite',
    size: { x: 108, y: 108 },
    shootInterval: 2000,
    bulletType: 'mixed', // 混合攻击模式
    shootPattern: 'mixed',
    spawnWeight: 15,
    health: 3,
    scoreValue: 300,
    speedMultiplier: 0.7, // 移动稍慢
    minScore: 1000, // 1000分后出现
  },
  BOSS: {
    id: 'boss',
    size: { x: 192, y: 192 },
    shootInterval: 1000, // 攻击间隔更短
    bulletType: 'all', // 所有攻击模式
    shootPattern: 'all',
    spawnWeight: 5,
    health: 15,
    scoreValue: 1000,
    speedMultiplier: 0.3, // 移动更慢
    minScore: 5000, // 5000分后出现
  },
} as const;

/**
 * 子弹类型配置
 */
export const BULLET_TYPES = {
  NORMAL: {
    size: { x: 12, y: 24 },
    speed: 200,
    color: '#ff8800',
  },
  LASER: {
    size: { x: 18, y: 96 }, // 激光束更长
    speed: 250,
    color: '#ff8800',
  },
} as const;
/**
 * 道具配置
 */
export const POWERUP_TYPES = {
  MISSILE: {
    id: 'missile',
    size: { x: 32, y: 32 },
    scoreRequirement: 1000, // 1000分时生成
    duration: 40000, // 持续40秒
  },
} as const;

/**
 * 导弹配置
 */
export const MISSILE_CONFIG = {
  speed: 350,
  size: { x: 6, y: 12 },
  angle: Math.PI / 4, // 45度角
  cooldown: 300, // 发射间隔300ms
} as const;