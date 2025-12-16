/**
 * 像素艺术颜色系统
 */

/**
 * 像素艺术调色板
 */
export const PIXEL_PALETTE = {
  // 主要颜色
  BLACK: '#000000',
  WHITE: '#ffffff',
  
  // 玩家颜色 (绿色系)
  PLAYER_PRIMARY: '#00ff41',
  PLAYER_SECONDARY: '#00cc33',
  PLAYER_DARK: '#008822',
  
  // 敌人颜色 (红色系)
  ENEMY_PRIMARY: '#ff0041',
  ENEMY_SECONDARY: '#cc0033',
  ENEMY_DARK: '#880022',
  
  // 子弹颜色
  BULLET_PLAYER: '#ffff41',
  BULLET_ENEMY: '#ff8841',
  
  // UI颜色
  UI_PRIMARY: '#41ffff',
  UI_SECONDARY: '#33cccc',
  UI_TEXT: '#ffffff',
  UI_BACKGROUND: '#000011',
  
  // 背景颜色
  SPACE_DARK: '#000011',
  SPACE_MEDIUM: '#001122',
  SPACE_LIGHT: '#002244',
  
  // 特效颜色
  EXPLOSION_1: '#ffff41',
  EXPLOSION_2: '#ff8841',
  EXPLOSION_3: '#ff4141',
} as const;

/**
 * 颜色工具函数
 */
export class ColorUtils {
  /**
   * 将十六进制颜色转换为RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  /**
   * 将RGB转换为十六进制颜色
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * 创建带透明度的颜色
   */
  static withAlpha(color: string, alpha: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  /**
   * 混合两种颜色
   */
  static blendColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
    
    return this.rgbToHex(r, g, b);
  }

  /**
   * 使颜色变亮
   */
  static lighten(color: string, amount: number): string {
    return this.blendColors(color, PIXEL_PALETTE.WHITE, amount);
  }

  /**
   * 使颜色变暗
   */
  static darken(color: string, amount: number): string {
    return this.blendColors(color, PIXEL_PALETTE.BLACK, amount);
  }

  /**
   * 获取随机像素艺术颜色
   */
  static getRandomPixelColor(): string {
    const colors = Object.values(PIXEL_PALETTE);
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

/**
 * 动画颜色效果
 */
export class AnimatedColor {
  private colors: string[];
  private currentIndex: number = 0;
  private timer: number = 0;
  private interval: number;

  constructor(colors: string[], interval: number = 200) {
    this.colors = colors;
    this.interval = interval;
  }

  /**
   * 更新动画
   */
  update(deltaTime: number): void {
    this.timer += deltaTime;
    if (this.timer >= this.interval) {
      this.timer = 0;
      this.currentIndex = (this.currentIndex + 1) % this.colors.length;
    }
  }

  /**
   * 获取当前颜色
   */
  getCurrentColor(): string {
    return this.colors[this.currentIndex];
  }

  /**
   * 重置动画
   */
  reset(): void {
    this.currentIndex = 0;
    this.timer = 0;
  }
}