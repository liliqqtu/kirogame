// 核心类型定义文件

/**
 * 2D向量接口
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * 游戏实体基础接口
 */
export interface GameEntity {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  active: boolean;
  update(deltaTime: number): void;
  render(renderer: Renderer): void;
}

/**
 * 渲染器接口
 */
export interface Renderer {
  clear(): void;
  drawRect(x: number, y: number, width: number, height: number, color: string): void;
  drawText(text: string, x: number, y: number, color: string, font?: string): void;
  setPixelPerfect(enabled: boolean): void;
  drawRectOutline(x: number, y: number, width: number, height: number, color: string, lineWidth?: number): void;
  drawCircle(x: number, y: number, radius: number, color: string): void;
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth?: number): void;
  save(): void;
  restore(): void;
  setAlpha(alpha: number): void;
  drawImage(image: HTMLImageElement, x: number, y: number, width?: number, height?: number): void;
  drawImagePart(image: HTMLImageElement, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth?: number, destHeight?: number): void;
  drawRotatedImage(image: HTMLImageElement, x: number, y: number, width: number, height: number, rotation: number): void;
  drawBackground(image: HTMLImageElement, mode?: 'stretch' | 'tile'): void;
}

/**
 * 游戏状态接口
 */
export interface GameState {
  player: PlayerShip;
  enemies: EnemyShip[];
  bullets: Bullet[];
  score: number;
  lives: number;
  gameTime: number;
  isGameOver: boolean;
  isPaused: boolean;
}

/**
 * 游戏配置接口
 */
export interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  player: {
    speed: number;
    size: Vector2D;
    shootCooldown: number;
    startPosition: Vector2D;
  };
  enemy: {
    baseSpeed: number;
    size: Vector2D;
    spawnRate: number;
    shootInterval: number;
  };
  bullet: {
    speed: number;
    size: Vector2D;
  };
  difficulty: {
    speedIncreaseRate: number;
    maxSpeed: number;
    enemySpawnIncreaseRate: number;
    timeInterval: number;
  };
  game: {
    initialLives: number;
    targetFPS: number;
  };
}

/**
 * 输入状态接口
 */
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
}

/**
 * 玩家飞船接口
 */
export interface PlayerShip extends GameEntity {
  speed: number;
  shootCooldown: number;
  lastShotTime: number;
  canShoot(): boolean;
  shoot(): Bullet | null;
  takeDamage(): void;
  respawn(): void;
}

/**
 * 敌人飞船接口
 */
export interface EnemyShip extends GameEntity {
  speed: number;
  shootTimer: number;
  shootInterval: number;
  enemyType: EnemyType;
  health: number;
  maxHealth: number;
  shouldShoot(): boolean;
  shoot(): Bullet | null;
  takeDamage(damage: number): boolean; // 返回是否被摧毁
}

/**
 * 敌人类型枚举
 */
export enum EnemyType {
  BASIC = 'basic',
  DIAGONAL = 'diagonal',
  LASER = 'laser',
  ELITE = 'elite',
  BOSS = 'boss',
}

/**
 * 子弹接口
 */
export interface Bullet extends GameEntity {
  owner: 'player' | 'enemy';
  damage: number;
  bulletType: BulletType;
}

/**
 * 子弹类型枚举
 */
export enum BulletType {
  NORMAL = 'normal',
  LASER = 'laser',
}

/**
 * 碰撞检测结果
 */
export interface CollisionResult {
  hasCollision: boolean;
  entity1: GameEntity;
  entity2: GameEntity;
}

/**
 * 游戏事件类型
 */
export type GameEvent = 
  | { type: 'ENEMY_DESTROYED'; enemy: EnemyShip; score: number }
  | { type: 'PLAYER_HIT'; damage: number }
  | { type: 'BULLET_FIRED'; bullet: Bullet }
  | { type: 'GAME_OVER' }
  | { type: 'LEVEL_UP'; newLevel: number };

/**
 * 实体类型枚举
 */
export enum EntityType {
  PLAYER = 'player',
  ENEMY = 'enemy',
  BULLET = 'bullet',
}

/**
 * 游戏状态枚举
 */
export enum GameStateType {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
}

/**
 * 道具类型枚举
 */
export enum PowerUpType {
  MISSILE = 'missile',
}

/**
 * 道具接口
 */
export interface PowerUp extends GameEntity {
  powerUpType: PowerUpType;
  collected: boolean;
  collect(): void;
}