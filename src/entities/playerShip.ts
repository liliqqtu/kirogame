import { PlayerShip, Bullet, Renderer, Vector2D, BulletType } from '@/types';
import { createVector2D, clamp } from '@/utils/math';
import { clampEntityToBounds } from '@/utils/collision';
import { PIXEL_PALETTE } from '@/systems/colorSystem';
import { DEFAULT_GAME_CONFIG, MISSILE_CONFIG, POWERUP_TYPES } from '@/utils/constants';
import { getAsset } from '@/systems/defaultAssets';

/**
 * 玩家飞船实现
 */
export class PlayerShipImpl implements PlayerShip {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  active: boolean;
  speed: number;
  shootCooldown: number;
  lastShotTime: number;
  
  private canvasWidth: number;
  private canvasHeight: number;
  private startPosition: Vector2D;
  
  // 导弹系统
  private hasMissiles: boolean = false;
  private missileEndTime: number = 0;
  private lastMissileTime: number = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // 从配置中获取初始值
    const config = DEFAULT_GAME_CONFIG.player;
    this.size = { ...config.size };
    this.speed = config.speed;
    this.shootCooldown = config.shootCooldown;
    
    // 计算起始位置（屏幕底部中央）
    this.startPosition = {
      x: (canvasWidth - this.size.x) / 2,
      y: canvasHeight - this.size.y - 20,
    };
    
    this.position = { ...this.startPosition };
    this.velocity = createVector2D(0, 0);
    this.active = true;
    this.lastShotTime = 0;
  }

  /**
   * 更新玩家飞船状态
   */
  update(deltaTime: number): void {
    if (!this.active) return;

    // 更新位置
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);

    // 限制在边界内
    clampEntityToBounds(this, this.canvasWidth, this.canvasHeight);

    // 更新射击冷却时间
    this.lastShotTime += deltaTime;
    
    // 更新导弹状态
    this.updateMissiles();
  }

  /**
   * 渲染玩家飞船
   */
  render(renderer: Renderer): void {
    if (!this.active) return;

    const playerImage = getAsset('player');
    
    if (playerImage) {
      // 使用图片渲染
      renderer.drawImage(
        playerImage,
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
        PIXEL_PALETTE.PLAYER_PRIMARY
      );

      // 绘制飞船细节
      const centerX = this.position.x + this.size.x / 2;
      const topY = this.position.y;
      
      // 飞船顶部
      renderer.drawRect(
        centerX - 2,
        topY - 4,
        4,
        4,
        PIXEL_PALETTE.PLAYER_SECONDARY
      );

      // 飞船侧翼
      renderer.drawRect(
        this.position.x - 2,
        this.position.y + this.size.y - 8,
        4,
        8,
        PIXEL_PALETTE.PLAYER_DARK
      );
      
      renderer.drawRect(
        this.position.x + this.size.x - 2,
        this.position.y + this.size.y - 8,
        4,
        8,
        PIXEL_PALETTE.PLAYER_DARK
      );
    }
  }

  /**
   * 设置移动速度
   */
  setVelocity(vx: number, vy: number): void {
    this.velocity.x = clamp(vx, -this.speed, this.speed);
    this.velocity.y = clamp(vy, -this.speed, this.speed);
  }

  /**
   * 根据输入更新移动
   */
  updateMovement(movementVector: Vector2D, _deltaTime: number): void {
    const normalizedSpeed = this.speed;
    
    this.velocity.x = movementVector.x * normalizedSpeed;
    this.velocity.y = movementVector.y * normalizedSpeed;
  }

  /**
   * 检查是否可以射击
   */
  canShoot(): boolean {
    return this.active && this.lastShotTime >= this.shootCooldown;
  }

  /**
   * 发射子弹
   */
  shoot(): Bullet | null {
    if (!this.canShoot()) return null;

    this.lastShotTime = 0;

    // 创建子弹（这里返回子弹数据，实际创建由子弹系统处理）
    const bulletData = {
      position: {
        x: this.position.x + this.size.x / 2 - 2,
        y: this.position.y - 8,
      },
      velocity: createVector2D(0, -DEFAULT_GAME_CONFIG.bullet.speed),
      size: { ...DEFAULT_GAME_CONFIG.bullet.size },
      owner: 'player' as const,
      damage: 1,
      bulletType: BulletType.NORMAL,
      active: true,
      update: () => {},
      render: () => {},
    };

    return bulletData;
  }

  /**
   * 受到伤害
   */
  takeDamage(): void {
    // 玩家飞船被击中的逻辑将由生命系统处理
    // 这里可以添加受伤效果
  }

  /**
   * 重生
   */
  respawn(): void {
    this.position = { ...this.startPosition };
    this.velocity = createVector2D(0, 0);
    this.active = true;
    this.lastShotTime = 0;
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
   * 设置位置
   */
  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
    clampEntityToBounds(this, this.canvasWidth, this.canvasHeight);
  }

  /**
   * 检查是否在边界内
   */
  isInBounds(): boolean {
    return (
      this.position.x >= 0 &&
      this.position.y >= 0 &&
      this.position.x + this.size.x <= this.canvasWidth &&
      this.position.y + this.size.y <= this.canvasHeight
    );
  }

  /**
   * 销毁飞船
   */
  destroy(): void {
    this.active = false;
  }

  /**
   * 获得导弹能力
   */
  gainMissiles(): void {
    this.hasMissiles = true;
    this.missileEndTime = Date.now() + POWERUP_TYPES.MISSILE.duration;
  }

  /**
   * 检查是否可以发射导弹
   */
  canShootMissile(): boolean {
    const currentTime = Date.now();
    return (
      this.active &&
      this.hasMissiles &&
      currentTime < this.missileEndTime &&
      currentTime - this.lastMissileTime >= MISSILE_CONFIG.cooldown
    );
  }

  /**
   * 发射导弹
   */
  shootMissile(): Bullet[] | null {
    if (!this.canShootMissile()) return null;

    this.lastMissileTime = Date.now();

    const missiles: Bullet[] = [];
    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y;

    // 计算45度角的速度分量
    const angle = Math.PI / 4; // 45度
    const speedComponent = MISSILE_CONFIG.speed * Math.cos(angle); // 45度时sin和cos相等
    const speedX = speedComponent; // 水平分量
    const speedY = speedComponent; // 垂直分量

    // 左斜导弹（向左上45度）
    const leftMissile = {
      position: {
        x: centerX - MISSILE_CONFIG.size.x / 2 - 10,
        y: centerY - 8,
      },
      velocity: createVector2D(-speedX, -speedY), // 左上45度
      size: { ...MISSILE_CONFIG.size },
      owner: 'player' as const,
      damage: 1,
      bulletType: BulletType.NORMAL,
      active: true,
      update: () => {},
      render: () => {},
    };

    // 右斜导弹（向右上45度）
    const rightMissile = {
      position: {
        x: centerX - MISSILE_CONFIG.size.x / 2 + 10,
        y: centerY - 8,
      },
      velocity: createVector2D(speedX, -speedY), // 右上45度
      size: { ...MISSILE_CONFIG.size },
      owner: 'player' as const,
      damage: 1,
      bulletType: BulletType.NORMAL,
      active: true,
      update: () => {},
      render: () => {},
    };

    missiles.push(leftMissile, rightMissile);
    return missiles;
  }

  /**
   * 更新导弹状态
   */
  updateMissiles(): void {
    const currentTime = Date.now();
    if (this.hasMissiles && currentTime >= this.missileEndTime) {
      this.hasMissiles = false;
    }
  }

  /**
   * 检查是否拥有导弹
   */
  hasMissileAbility(): boolean {
    return this.hasMissiles && Date.now() < this.missileEndTime;
  }

  /**
   * 获取导弹剩余时间（秒）
   */
  getMissileTimeLeft(): number {
    if (!this.hasMissiles) return 0;
    const timeLeft = Math.max(0, this.missileEndTime - Date.now());
    return Math.ceil(timeLeft / 1000);
  }
}