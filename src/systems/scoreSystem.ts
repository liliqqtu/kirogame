import { SCORING } from '@/utils/constants';

/**
 * 得分系统
 */
export class ScoreSystem {
  private score: number;
  private highScore: number;

  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
  }

  /**
   * 获取当前分数
   */
  getScore(): number {
    return this.score;
  }

  /**
   * 获取最高分数
   */
  getHighScore(): number {
    return this.highScore;
  }

  /**
   * 增加分数
   */
  addScore(points: number): void {
    this.score += Math.max(0, points);
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  /**
   * 击毁敌人获得分数
   */
  enemyDestroyed(): void {
    this.addScore(SCORING.ENEMY_KILL);
  }

  /**
   * 重置分数
   */
  reset(): void {
    this.score = 0;
  }

  /**
   * 从本地存储加载最高分
   */
  private loadHighScore(): number {
    try {
      const saved = localStorage.getItem('pixelShooterHighScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * 保存最高分到本地存储
   */
  private saveHighScore(): void {
    try {
      localStorage.setItem('pixelShooterHighScore', this.highScore.toString());
    } catch {
      // 忽略存储错误
    }
  }
}