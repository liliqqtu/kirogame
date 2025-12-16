import { DEFAULT_GAME_CONFIG } from '@/utils/constants';

/**
 * 难度系统
 */
export class DifficultySystem {
  private gameTime: number;
  private currentLevel: number;
  private baseSpawnRate: number;
  private baseEnemySpeed: number;
  private baseBulletSpeed: number;
  private basePlayerSpeed: number;
  
  private currentSpawnRate: number;
  private currentEnemySpeed: number;
  private currentBulletSpeed: number;
  private currentPlayerSpeed: number;
  
  private readonly config = DEFAULT_GAME_CONFIG.difficulty;

  constructor() {
    this.gameTime = 0;
    this.currentLevel = 1;
    
    // 保存基础值
    this.baseSpawnRate = DEFAULT_GAME_CONFIG.enemy.spawnRate;
    this.baseEnemySpeed = DEFAULT_GAME_CONFIG.enemy.baseSpeed;
    this.baseBulletSpeed = DEFAULT_GAME_CONFIG.bullet.speed;
    this.basePlayerSpeed = DEFAULT_GAME_CONFIG.player.speed;
    
    // 初始化当前值
    this.currentSpawnRate = this.baseSpawnRate;
    this.currentEnemySpeed = this.baseEnemySpeed;
    this.currentBulletSpeed = this.baseBulletSpeed;
    this.currentPlayerSpeed = this.basePlayerSpeed;
  }

  /**
   * 更新难度系统
   */
  update(deltaTime: number): void {
    this.gameTime += deltaTime;
    
    // 计算当前等级
    const newLevel = Math.floor(this.gameTime / this.config.timeInterval) + 1;
    
    if (newLevel > this.currentLevel) {
      this.currentLevel = newLevel;
      this.updateDifficulty();
    }
  }

  /**
   * 更新难度参数
   */
  private updateDifficulty(): void {
    const levelMultiplier = this.currentLevel - 1;
    
    // 更新敌人生成率（减少间隔 = 增加频率）
    this.currentSpawnRate = Math.max(
      200, // 最小间隔200ms
      this.baseSpawnRate * Math.pow(this.config.enemySpawnIncreaseRate, levelMultiplier)
    );
    
    // 更新速度（但不超过最大值）
    const speedMultiplier = Math.pow(this.config.speedIncreaseRate, levelMultiplier);
    
    this.currentEnemySpeed = Math.min(
      this.config.maxSpeed,
      this.baseEnemySpeed * speedMultiplier
    );
    
    this.currentBulletSpeed = Math.min(
      this.config.maxSpeed,
      this.baseBulletSpeed * speedMultiplier
    );
    
    this.currentPlayerSpeed = Math.min(
      this.config.maxSpeed,
      this.basePlayerSpeed * speedMultiplier
    );
  }

  /**
   * 获取当前敌人生成率
   */
  getCurrentSpawnRate(): number {
    return this.currentSpawnRate;
  }

  /**
   * 获取当前敌人速度
   */
  getCurrentEnemySpeed(): number {
    return this.currentEnemySpeed;
  }

  /**
   * 获取当前子弹速度
   */
  getCurrentBulletSpeed(): number {
    return this.currentBulletSpeed;
  }

  /**
   * 获取当前玩家速度
   */
  getCurrentPlayerSpeed(): number {
    return this.currentPlayerSpeed;
  }

  /**
   * 获取当前等级
   */
  getCurrentLevel(): number {
    return this.currentLevel;
  }

  /**
   * 获取游戏时间
   */
  getGameTime(): number {
    return this.gameTime;
  }

  /**
   * 检查速度是否已达到最大值
   */
  isMaxSpeedReached(): boolean {
    return (
      this.currentEnemySpeed >= this.config.maxSpeed ||
      this.currentBulletSpeed >= this.config.maxSpeed ||
      this.currentPlayerSpeed >= this.config.maxSpeed
    );
  }

  /**
   * 重置难度系统
   */
  reset(): void {
    this.gameTime = 0;
    this.currentLevel = 1;
    this.currentSpawnRate = this.baseSpawnRate;
    this.currentEnemySpeed = this.baseEnemySpeed;
    this.currentBulletSpeed = this.baseBulletSpeed;
    this.currentPlayerSpeed = this.basePlayerSpeed;
  }

  /**
   * 获取难度信息
   */
  getDifficultyInfo(): {
    level: number;
    gameTime: number;
    spawnRate: number;
    enemySpeed: number;
    bulletSpeed: number;
    playerSpeed: number;
    maxSpeedReached: boolean;
  } {
    return {
      level: this.currentLevel,
      gameTime: this.gameTime,
      spawnRate: this.currentSpawnRate,
      enemySpeed: this.currentEnemySpeed,
      bulletSpeed: this.currentBulletSpeed,
      playerSpeed: this.currentPlayerSpeed,
      maxSpeedReached: this.isMaxSpeedReached(),
    };
  }
}