import { PowerUp, PowerUpType, Renderer, Vector2D } from '@/types';
import { createVector2D } from '@/utils/math';
import { POWERUP_TYPES } from '@/utils/constants';
import { getAsset } from '@/systems/defaultAssets';

/**
 * 道具实现
 */
export class PowerUpImpl implements PowerUp {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  active: boolean;
  powerUpType: PowerUpType;
  collected: boolean;

  private canvasHeight: number;
  private floatTimer: number = 0; // 用于浮动动画

  constructor(
    position: Vector2D,
    powerUpType: PowerUpType,
    _canvasWidth: number,
    canvasHeight: number
  ) {
    this.position = { ...position };
    this.powerUpType = powerUpType;
    this.canvasHeight = canvasHeight;
    this.collected = false;
    this.active = true;

    // 根据道具类型设置属性
    const config = Object.values(POWERUP_TYPES).find(p => p.id === powerUpType) || POWERUP_TYPES.MISSILE;
    this.size = { ...config.size };
    
    // 道具缓慢下降
    this.velocity = createVector2D(0, 30);
  }

  /**
   * 更新道具状态
   */
  update(deltaTime: number): void {
    if (!this.active || this.collected) return;

    // 更新位置
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);

    // 浮动动画
    this.floatTimer += deltaTime;
    const floatOffset = Math.sin(this.floatTimer / 500) * 2;
    this.position.y += floatOffset * (deltaTime / 1000);

    // 检查是否超出边界
    if (this.position.y > this.canvasHeight + this.size.y) {
      this.active = false;
    }
  }

  /**
   * 渲染道具
   */
  render(renderer: Renderer): void {
    if (!this.active || this.collected) return;

    const assetName = `powerup-${this.powerUpType}`;
    const powerUpImage = getAsset(assetName);
    
    if (powerUpImage) {
      // 使用图片渲染
      renderer.drawImage(
        powerUpImage,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    } else {
      // 降级到矩形渲染
      this.renderFallback(renderer);
    }

    // 添加发光效果
    this.renderGlowEffect(renderer);
  }

  /**
   * 降级渲染
   */
  private renderFallback(renderer: Renderer): void {
    if (this.powerUpType === PowerUpType.MISSILE) {
      // 导弹包 - 绿色
      renderer.drawRect(
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y,
        '#00FF00'
      );
      
      // 导弹图标
      renderer.drawRect(
        this.position.x + 8,
        this.position.y + 4,
        16,
        4,
        '#FFFF00'
      );
      
      renderer.drawRect(
        this.position.x + 12,
        this.position.y + 8,
        8,
        16,
        '#FFFF00'
      );
      
      // 边框
      renderer.drawRectOutline(
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y,
        '#FFFFFF',
        2
      );
    }
  }

  /**
   * 渲染发光效果
   */
  private renderGlowEffect(renderer: Renderer): void {
    const glowIntensity = (Math.sin(this.floatTimer / 200) + 1) / 2; // 0-1之间
    const glowSize = 4 + glowIntensity * 2;
    
    renderer.setAlpha(0.3 * glowIntensity);
    renderer.drawRect(
      this.position.x - glowSize,
      this.position.y - glowSize,
      this.size.x + glowSize * 2,
      this.size.y + glowSize * 2,
      '#00FFFF'
    );
    renderer.setAlpha(1);
  }

  /**
   * 收集道具
   */
  collect(): void {
    this.collected = true;
    this.active = false;
  }

  /**
   * 检查是否与玩家碰撞
   */
  checkCollision(playerPosition: Vector2D, playerSize: Vector2D): boolean {
    return (
      this.position.x < playerPosition.x + playerSize.x &&
      this.position.x + this.size.x > playerPosition.x &&
      this.position.y < playerPosition.y + playerSize.y &&
      this.position.y + this.size.y > playerPosition.y
    );
  }
}

/**
 * 道具管理器
 */
export class PowerUpManager {
  private powerUps: PowerUpImpl[] = [];
  private canvasWidth: number;
  private canvasHeight: number;
  private spawnedMissilePackages: Set<number> = new Set(); // 追踪已生成导弹包的分数点

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  /**
   * 更新所有道具
   */
  update(deltaTime: number, currentScore: number): void {
    // 检查是否需要生成导弹包
    this.checkMissilePackageSpawn(currentScore);

    // 更新现有道具
    for (const powerUp of this.powerUps) {
      powerUp.update(deltaTime);
    }

    // 移除非活跃的道具
    this.powerUps = this.powerUps.filter(powerUp => powerUp.active);
  }

  /**
   * 检查导弹包生成条件
   */
  private checkMissilePackageSpawn(currentScore: number): void {
    // 1000分必定生成一个
    if (currentScore >= 1000 && !this.spawnedMissilePackages.has(1000)) {
      this.spawnMissilePackage();
      this.spawnedMissilePackages.add(1000);
      return;
    }

    // 之后每5000*n-500分生成（即4500, 9500, 14500, 19500...）
    for (let n = 1; n <= 20; n++) { // 限制检查范围避免无限循环
      const spawnScore = 5000 * n - 500; // 4500, 9500, 14500...
      if (currentScore >= spawnScore && !this.spawnedMissilePackages.has(spawnScore)) {
        this.spawnMissilePackage();
        this.spawnedMissilePackages.add(spawnScore);
        console.log(`在${spawnScore}分生成导弹包！`);
        break; // 一次只生成一个
      }
    }
  }

  /**
   * 渲染所有道具
   */
  render(renderer: Renderer): void {
    for (const powerUp of this.powerUps) {
      powerUp.render(renderer);
    }
  }

  /**
   * 生成导弹包
   */
  private spawnMissilePackage(): void {
    const x = this.canvasWidth / 2 - 16; // 屏幕中间
    const y = this.canvasHeight / 2 - 16;
    const position = createVector2D(x, y);
    
    const missilePackage = new PowerUpImpl(
      position,
      PowerUpType.MISSILE,
      this.canvasWidth,
      this.canvasHeight
    );
    
    this.powerUps.push(missilePackage);
  }

  /**
   * 检查道具收集
   */
  checkCollisions(playerPosition: Vector2D, playerSize: Vector2D): PowerUpImpl[] {
    const collectedPowerUps: PowerUpImpl[] = [];
    
    for (const powerUp of this.powerUps) {
      if (!powerUp.collected && powerUp.checkCollision(playerPosition, playerSize)) {
        powerUp.collect();
        collectedPowerUps.push(powerUp);
      }
    }
    
    return collectedPowerUps;
  }

  /**
   * 获取所有活跃道具
   */
  getActivePowerUps(): PowerUpImpl[] {
    return this.powerUps.filter(powerUp => powerUp.active);
  }

  /**
   * 清空所有道具
   */
  clear(): void {
    this.powerUps = [];
    this.spawnedMissilePackages.clear();
  }

  /**
   * 重置导弹包生成状态（用于新游戏）
   */
  resetMissilePackage(): void {
    this.spawnedMissilePackages.clear();
  }
}