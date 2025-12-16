import { DEFAULT_GAME_CONFIG } from '@/utils/constants';

/**
 * 生命系统
 */
export class LifeSystem {
  private lives: number;
  private maxLives: number;
  private gameOver: boolean;

  constructor() {
    this.maxLives = DEFAULT_GAME_CONFIG.game.initialLives;
    this.lives = this.maxLives;
    this.gameOver = false;
  }

  /**
   * 获取当前生命数
   */
  getLives(): number {
    return this.lives;
  }

  /**
   * 获取最大生命数
   */
  getMaxLives(): number {
    return this.maxLives;
  }

  /**
   * 失去一条生命
   */
  loseLife(): boolean {
    if (this.gameOver) return false;

    this.lives = Math.max(0, this.lives - 1);
    
    if (this.lives <= 0) {
      this.gameOver = true;
    }

    return true;
  }

  /**
   * 增加生命
   */
  addLife(): void {
    if (!this.gameOver) {
      this.lives = Math.min(this.maxLives, this.lives + 1);
    }
  }

  /**
   * 检查游戏是否结束
   */
  isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * 重置生命系统
   */
  reset(): void {
    this.lives = this.maxLives;
    this.gameOver = false;
  }

  /**
   * 检查是否还有生命
   */
  hasLives(): boolean {
    return this.lives > 0;
  }
}