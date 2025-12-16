import { EnemyShip, Bullet, Renderer, Vector2D, EnemyType, BulletType } from '@/types';
import { createVector2D } from '@/utils/math';
import { PIXEL_PALETTE } from '@/systems/colorSystem';
import { DEFAULT_GAME_CONFIG, ENEMY_TYPES, BULLET_TYPES } from '@/utils/constants';
import { getAsset } from '@/systems/defaultAssets';

/**
 * 敌人飞船实现
 */
export class EnemyShipImpl implements EnemyShip {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  active: boolean;
  speed: number;
  shootTimer: number;
  shootInterval: number;
  enemyType: EnemyType;
  health: number;
  maxHealth: number;

  private canvasWidth: number;
  private canvasHeight: number;
  private movementTimer: number = 0; // 用于Boss的移动模式

  constructor(
    position: Vector2D,
    canvasWidth: number,
    canvasHeight: number,
    enemyType: EnemyType = EnemyType.BASIC,
    speed?: number
  ) {
    this.position = { ...position };
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.enemyType = enemyType;
    
    // 根据敌人类型获取配置
    const typeConfig = Object.values(ENEMY_TYPES).find(t => t.id === enemyType) || ENEMY_TYPES.BASIC;
    this.size = { ...typeConfig.size };
    this.speed = (speed || DEFAULT_GAME_CONFIG.enemy.baseSpeed) * typeConfig.speedMultiplier;
    this.shootInterval = typeConfig.shootInterval;
    this.health = typeConfig.health;
    this.maxHealth = typeConfig.health;
    
    // 设置移动速度
    if (enemyType === EnemyType.BOSS) {
      // Boss随机选择初始移动方向
      const horizontal = (Math.random() - 0.5) * this.speed * 0.5; // 横向移动较慢
      this.velocity = createVector2D(horizontal, this.speed);
    } else {
      // 其他敌人向下移动
      this.velocity = createVector2D(0, this.speed);
    }
    
    this.active = true;
    this.shootTimer = Math.random() * this.shootInterval; // 随机初始射击时间
  }

  /**
   * 更新敌人飞船状态
   */
  update(deltaTime: number): void {
    if (!this.active) return;

    // Boss特殊移动逻辑
    if (this.enemyType === EnemyType.BOSS) {
      this.updateBossMovement(deltaTime);
    }

    // 更新位置
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);

    // 更新射击计时器
    this.shootTimer += deltaTime;

    // 检查是否超出边界
    this.checkBounds();
  }

  /**
   * Boss特殊移动逻辑
   */
  private updateBossMovement(deltaTime: number): void {
    this.movementTimer += deltaTime;
    
    // 每3秒改变一次移动方向
    if (this.movementTimer >= 3000) {
      this.movementTimer = 0;
      
      // 随机选择移动模式：纯向下、左下、右下
      const movePattern = Math.random();
      if (movePattern < 0.4) {
        // 纯向下
        this.velocity.x = 0;
      } else if (movePattern < 0.7) {
        // 左下移动
        this.velocity.x = -this.speed * 0.3;
      } else {
        // 右下移动
        this.velocity.x = this.speed * 0.3;
      }
    }
    
    // 边界检查，防止Boss移出屏幕
    if (this.position.x <= 0 && this.velocity.x < 0) {
      this.velocity.x = Math.abs(this.velocity.x);
    } else if (this.position.x + this.size.x >= this.canvasWidth && this.velocity.x > 0) {
      this.velocity.x = -Math.abs(this.velocity.x);
    }
  }

  /**
   * 渲染敌人飞船
   */
  render(renderer: Renderer): void {
    if (!this.active) return;

    const assetName = `enemy-${this.enemyType}`;
    const enemyImage = getAsset(assetName);
    
    // 调试信息
    if (!enemyImage) {
      console.log(`敌人图片未找到: ${assetName}, 类型: ${this.enemyType}`);
    }
    
    if (enemyImage) {
      // 使用图片渲染
      renderer.drawImage(
        enemyImage,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    } else {
      // 降级到矩形渲染
      renderer.drawRect(
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y,
        PIXEL_PALETTE.ENEMY_PRIMARY
      );

      // 绘制飞船细节
      const centerX = this.position.x + this.size.x / 2;
      const bottomY = this.position.y + this.size.y;
      
      // 飞船底部（朝下的尖端）
      renderer.drawRect(
        centerX - 2,
        bottomY,
        4,
        4,
        PIXEL_PALETTE.ENEMY_SECONDARY
      );

      // 飞船侧翼
      renderer.drawRect(
        this.position.x - 2,
        this.position.y + 4,
        4,
        8,
        PIXEL_PALETTE.ENEMY_DARK
      );
      
      renderer.drawRect(
        this.position.x + this.size.x - 2,
        this.position.y + 4,
        4,
        8,
        PIXEL_PALETTE.ENEMY_DARK
      );

      // 飞船核心（发光效果）
      renderer.drawRect(
        centerX - 1,
        this.position.y + this.size.y / 2 - 1,
        2,
        2,
        PIXEL_PALETTE.ENEMY_SECONDARY
      );
    }

    // 渲染血条（只有血量大于1的敌人才显示）
    if (this.maxHealth > 1) {
      this.renderHealthBar(renderer);
    }
  }

  /**
   * 渲染血条
   */
  private renderHealthBar(renderer: Renderer): void {
    const barWidth = this.size.x;
    const barHeight = 4;
    const barX = this.position.x;
    const barY = this.position.y - 8;

    // 血条背景
    renderer.drawRect(barX, barY, barWidth, barHeight, '#333333');

    // 血条
    const healthRatio = this.health / this.maxHealth;
    const healthWidth = barWidth * healthRatio;
    
    // 根据血量比例选择颜色
    let healthColor = '#00FF00'; // 绿色
    if (healthRatio < 0.3) {
      healthColor = '#FF0000'; // 红色
    } else if (healthRatio < 0.6) {
      healthColor = '#FFFF00'; // 黄色
    }

    renderer.drawRect(barX, barY, healthWidth, barHeight, healthColor);

    // 血条边框
    renderer.drawRectOutline(barX, barY, barWidth, barHeight, '#FFFFFF', 1);
  }

  /**
   * 受到伤害
   */
  takeDamage(damage: number): boolean {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
      return true; // 敌人被摧毁
    }
    return false; // 敌人还活着
  }

  /**
   * 检查是否应该射击
   */
  shouldShoot(): boolean {
    return this.active && this.shootTimer >= this.shootInterval;
  }

  /**
   * 发射子弹
   */
  shoot(): Bullet | null {
    if (!this.shouldShoot()) return null;

    this.shootTimer = 0;

    const typeConfig = Object.values(ENEMY_TYPES).find(t => t.id === this.enemyType) || ENEMY_TYPES.BASIC;
    
    // 根据敌人类型和射击模式确定子弹类型
    let bulletType = BulletType.NORMAL;
    if (typeConfig.bulletType === 'laser') {
      bulletType = BulletType.LASER;
    } else if (typeConfig.bulletType === 'all' && Math.random() < 0.2) {
      // Boss有20%概率发射激光
      bulletType = BulletType.LASER;
    }
    
    const bulletConfig = bulletType === BulletType.LASER ? BULLET_TYPES.LASER : BULLET_TYPES.NORMAL;
    
    // 创建子弹数据
    const bulletData = {
      position: {
        x: this.position.x + this.size.x / 2 - bulletConfig.size.x / 2,
        y: this.position.y + this.size.y + 4,
      },
      velocity: this.getShootVelocity(),
      size: { ...bulletConfig.size },
      owner: 'enemy' as const,
      damage: 1,
      bulletType: bulletType,
      active: true,
      update: () => {},
      render: () => {},
    };

    return bulletData;
  }

  /**
   * 根据敌人类型获取射击速度向量
   */
  private getShootVelocity(): Vector2D {
    const typeConfig = Object.values(ENEMY_TYPES).find(t => t.id === this.enemyType) || ENEMY_TYPES.BASIC;
    const bulletConfig = typeConfig.bulletType === 'laser' ? BULLET_TYPES.LASER : BULLET_TYPES.NORMAL;
    
    switch (typeConfig.shootPattern) {
      case 'diagonal':
        // 斜射敌人：随机选择左斜或右斜
        const angle = Math.random() < 0.5 ? -0.5 : 0.5; // 左斜或右斜
        return createVector2D(bulletConfig.speed * angle, bulletConfig.speed);
        
      case 'mixed':
        // 精英怪：随机选择直射或斜射
        if (Math.random() < 0.5) {
          // 直射
          return createVector2D(0, bulletConfig.speed);
        } else {
          // 斜射
          const diagonalAngle = Math.random() < 0.5 ? -0.5 : 0.5;
          return createVector2D(bulletConfig.speed * diagonalAngle, bulletConfig.speed);
        }
        
      case 'all':
        // Boss：随机选择所有攻击模式
        const pattern = Math.random();
        if (pattern < 0.4) {
          // 直射
          return createVector2D(0, bulletConfig.speed);
        } else if (pattern < 0.8) {
          // 斜射
          const bossAngle = Math.random() < 0.5 ? -0.6 : 0.6;
          return createVector2D(bulletConfig.speed * bossAngle, bulletConfig.speed);
        } else {
          // 激光（Boss可以发射激光）
          return createVector2D(0, BULLET_TYPES.LASER.speed);
        }
        
      case 'straight':
      default:
        // 直射
        return createVector2D(0, bulletConfig.speed);
    }
  }

  /**
   * 检查边界并处理超出情况
   */
  private checkBounds(): void {
    // 如果敌人到达屏幕底部，标记为非活跃（这将触发玩家失去生命）
    if (this.position.y > this.canvasHeight) {
      this.destroy();
    }

    // 水平边界检查（如果需要左右移动的敌人）
    if (this.position.x + this.size.x < 0 || this.position.x > this.canvasWidth) {
      this.destroy();
    }
  }

  /**
   * 获取中心位置
   */
  getCenterPosition(): Vector2D {
    return {
      x: this.position.x + this.size.x / 2,
      y: this.position.y + this.size.y / 2,
    };
  }

  /**
   * 设置移动速度
   */
  setSpeed(speed: number): void {
    this.speed = speed;
    this.velocity.y = speed;
  }

  /**
   * 设置射击间隔
   */
  setShootInterval(interval: number): void {
    this.shootInterval = interval;
  }

  /**
   * 检查是否在屏幕内
   */
  isInBounds(): boolean {
    return (
      this.position.x + this.size.x >= 0 &&
      this.position.x <= this.canvasWidth &&
      this.position.y + this.size.y >= 0 &&
      this.position.y <= this.canvasHeight
    );
  }

  /**
   * 检查是否到达屏幕底部
   */
  hasReachedBottom(): boolean {
    return this.position.y >= this.canvasHeight;
  }

  /**
   * 销毁敌人飞船
   */
  destroy(): void {
    this.active = false;
  }

  /**
   * 重置射击计时器
   */
  resetShootTimer(): void {
    this.shootTimer = 0;
  }

  /**
   * 获取边界框
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.x,
      height: this.size.y,
    };
  }
}

/**
 * 敌人生成器
 */
export class EnemySpawner {
  public canvasWidth: number;
  public canvasHeight: number;
  public baseSpeed: number;
  private spawnRate: number;
  private lastSpawnTime: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.spawnRate = DEFAULT_GAME_CONFIG.enemy.spawnRate;
    this.lastSpawnTime = 0;
    this.baseSpeed = DEFAULT_GAME_CONFIG.enemy.baseSpeed;
  }

  /**
   * 更新生成器
   */
  update(deltaTime: number, currentScore: number = 0, hasBoss: boolean = false): EnemyShipImpl | null {
    this.lastSpawnTime += deltaTime;

    if (this.lastSpawnTime >= this.spawnRate) {
      this.lastSpawnTime = 0;
      return this.spawnEnemy(currentScore, hasBoss);
    }

    return null;
  }

  /**
   * 生成敌人
   */
  private spawnEnemy(currentScore: number = 0, hasBoss: boolean = false): EnemyShipImpl {
    // 随机选择敌人类型（基于权重和分数，排除Boss）
    const enemyType = this.getRandomEnemyType(currentScore, hasBoss);
    const typeConfig = Object.values(ENEMY_TYPES).find(t => t.id === enemyType) || ENEMY_TYPES.BASIC;
    
    // 在屏幕顶部随机位置生成
    const x = Math.random() * (this.canvasWidth - typeConfig.size.x);
    const y = -typeConfig.size.y;

    const position = createVector2D(x, y);
    return new EnemyShipImpl(position, this.canvasWidth, this.canvasHeight, enemyType, this.baseSpeed);
  }

  /**
   * 设置生成率
   */
  setSpawnRate(rate: number): void {
    this.spawnRate = Math.max(100, rate); // 最小100ms间隔
  }

  /**
   * 设置敌人速度
   */
  setEnemySpeed(speed: number): void {
    this.baseSpeed = speed;
  }

  /**
   * 强制生成敌人
   */
  forceSpawn(): EnemyShipImpl {
    return this.spawnEnemy();
  }

  /**
   * 重置生成计时器
   */
  reset(): void {
    this.lastSpawnTime = 0;
  }

  /**
   * 根据权重和分数要求随机选择敌人类型
   */
  private getRandomEnemyType(currentScore: number = 0, hasBoss: boolean = false): EnemyType {
    // 过滤出符合分数要求的敌人类型，如果已有Boss则排除Boss
    let availableTypes = Object.values(ENEMY_TYPES).filter(type => currentScore >= type.minScore);
    
    // 如果场上已有Boss，则不生成新的Boss
    if (hasBoss) {
      availableTypes = availableTypes.filter(type => type.id !== 'boss');
    }
    
    if (availableTypes.length === 0) {
      return EnemyType.BASIC;
    }
    
    const totalWeight = availableTypes.reduce((sum, type) => sum + type.spawnWeight, 0);
    let random = Math.random() * totalWeight;
    
    for (const type of availableTypes) {
      random -= type.spawnWeight;
      if (random <= 0) {
        return type.id as EnemyType;
      }
    }
    
    return EnemyType.BASIC; // 默认返回基础类型
  }
}

/**
 * 敌人管理器
 */
export class EnemyManager {
  private enemies: EnemyShipImpl[] = [];
  private spawner: EnemySpawner;
  private maxEnemies: number;
  private currentScore: number = 0;
  private lastBossScore: number = 0; // 上次生成Boss时的分数

  constructor(canvasWidth: number, canvasHeight: number, maxEnemies: number = 20) {
    this.spawner = new EnemySpawner(canvasWidth, canvasHeight);
    this.maxEnemies = maxEnemies;
  }

  /**
   * 更新所有敌人
   */
  update(deltaTime: number): void {
    // 更新现有敌人
    for (const enemy of this.enemies) {
      enemy.update(deltaTime);
    }

    // 移除非活跃的敌人
    this.enemies = this.enemies.filter(enemy => enemy.active);

    // 检查是否需要强制生成Boss
    this.checkBossSpawn();

    // 尝试生成新敌人
    if (this.enemies.length < this.maxEnemies) {
      const newEnemy = this.spawner.update(deltaTime, this.currentScore, this.hasBoss());
      if (newEnemy) {
        this.enemies.push(newEnemy);
      }
    }
  }

  /**
   * 渲染所有敌人
   */
  render(renderer: Renderer): void {
    for (const enemy of this.enemies) {
      enemy.render(renderer);
    }
  }

  /**
   * 获取所有活跃的敌人
   */
  getActiveEnemies(): EnemyShipImpl[] {
    return this.enemies.filter(enemy => enemy.active);
  }

  /**
   * 获取应该射击的敌人
   */
  getShootingEnemies(): EnemyShipImpl[] {
    return this.enemies.filter(enemy => enemy.active && enemy.shouldShoot());
  }

  /**
   * 获取到达底部的敌人
   */
  getEnemiesAtBottom(): EnemyShipImpl[] {
    return this.enemies.filter(enemy => enemy.active && enemy.hasReachedBottom());
  }

  /**
   * 移除敌人
   */
  removeEnemy(enemy: EnemyShipImpl): void {
    enemy.destroy();
  }

  /**
   * 清空所有敌人
   */
  clear(): void {
    this.enemies = [];
  }

  /**
   * 获取敌人数量
   */
  getCount(): number {
    return this.enemies.length;
  }

  /**
   * 获取活跃敌人数量
   */
  getActiveCount(): number {
    return this.enemies.filter(enemy => enemy.active).length;
  }

  /**
   * 设置难度参数
   */
  setDifficulty(spawnRate: number, enemySpeed: number): void {
    this.spawner.setSpawnRate(spawnRate);
    this.spawner.setEnemySpeed(enemySpeed);
  }

  /**
   * 设置当前分数
   */
  setCurrentScore(score: number): void {
    this.currentScore = score;
  }

  /**
   * 获取敌人的分数值
   */
  getEnemyScoreValue(enemy: EnemyShipImpl): number {
    const typeConfig = Object.values(ENEMY_TYPES).find(t => t.id === enemy.enemyType) || ENEMY_TYPES.BASIC;
    return typeConfig.scoreValue;
  }

  /**
   * 检查是否有Boss在场
   */
  hasBoss(): boolean {
    return this.enemies.some(enemy => enemy.enemyType === EnemyType.BOSS && enemy.active);
  }

  /**
   * 检查Boss生成条件
   */
  private checkBossSpawn(): void {
    // 每5000分必定生成一个Boss，且场上没有Boss时
    const bossThreshold = Math.floor(this.currentScore / 5000) * 5000;
    
    if (bossThreshold > this.lastBossScore && bossThreshold >= 5000 && !this.hasBoss()) {
      this.spawnBoss();
      this.lastBossScore = bossThreshold;
    }
  }

  /**
   * 强制生成Boss
   */
  private spawnBoss(): void {
    const typeConfig = ENEMY_TYPES.BOSS;
    const x = Math.random() * (this.spawner.canvasWidth - typeConfig.size.x);
    const y = -typeConfig.size.y;
    const position = createVector2D(x, y);
    
    const boss = new EnemyShipImpl(
      position,
      this.spawner.canvasWidth,
      this.spawner.canvasHeight,
      EnemyType.BOSS,
      this.spawner.baseSpeed
    );
    
    this.enemies.push(boss);
    console.log('Boss已生成！');
  }

  /**
   * 重置Boss生成状态
   */
  resetBossSpawn(): void {
    this.lastBossScore = 0;
  }
}