import { Renderer } from '@/types';
import { COLORS } from '@/utils/constants';

/**
 * Canvas渲染器实现
 */
export class CanvasRenderer implements Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('无法获取Canvas 2D上下文');
    }
    
    this.canvas = canvas;
    this.ctx = ctx;
    
    // 默认启用像素完美渲染
    this.setPixelPerfect(true);
  }

  /**
   * 清空画布
   */
  clear(): void {
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 绘制矩形
   */
  drawRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
  }

  /**
   * 绘制文本
   */
  drawText(text: string, x: number, y: number, color: string, font: string = '16px Courier New'): void {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, Math.floor(x), Math.floor(y));
  }

  /**
   * 设置像素完美渲染
   */
  setPixelPerfect(enabled: boolean): void {
    this.ctx.imageSmoothingEnabled = !enabled;
    
    // 设置像素艺术风格的渲染属性
    if (enabled) {
      this.canvas.style.imageRendering = 'pixelated';
      this.canvas.style.imageRendering = '-moz-crisp-edges';
      this.canvas.style.imageRendering = 'crisp-edges';
    }
  }

  /**
   * 绘制边框矩形
   */
  drawRectOutline(x: number, y: number, width: number, height: number, color: string, lineWidth: number = 1): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
  }

  /**
   * 绘制圆形
   */
  drawCircle(x: number, y: number, radius: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(Math.floor(x), Math.floor(y), radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  /**
   * 绘制线条
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number = 1): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(Math.floor(x1), Math.floor(y1));
    this.ctx.lineTo(Math.floor(x2), Math.floor(y2));
    this.ctx.stroke();
  }

  /**
   * 保存渲染状态
   */
  save(): void {
    this.ctx.save();
  }

  /**
   * 恢复渲染状态
   */
  restore(): void {
    this.ctx.restore();
  }

  /**
   * 设置透明度
   */
  setAlpha(alpha: number): void {
    this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * 获取Canvas尺寸
   */
  getSize(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  /**
   * 获取Canvas元素
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * 获取渲染上下文
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * 绘制图片
   */
  drawImage(
    image: HTMLImageElement,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void {
    const drawX = Math.floor(x);
    const drawY = Math.floor(y);
    
    if (width !== undefined && height !== undefined) {
      this.ctx.drawImage(
        image,
        drawX,
        drawY,
        Math.floor(width),
        Math.floor(height)
      );
    } else {
      this.ctx.drawImage(image, drawX, drawY);
    }
  }

  /**
   * 绘制图片的一部分（精灵表支持）
   */
  drawImagePart(
    image: HTMLImageElement,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destX: number,
    destY: number,
    destWidth?: number,
    destHeight?: number
  ): void {
    const drawDestX = Math.floor(destX);
    const drawDestY = Math.floor(destY);
    const drawDestWidth = destWidth ? Math.floor(destWidth) : sourceWidth;
    const drawDestHeight = destHeight ? Math.floor(destHeight) : sourceHeight;
    
    this.ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      drawDestX,
      drawDestY,
      drawDestWidth,
      drawDestHeight
    );
  }

  /**
   * 绘制旋转的图片
   */
  drawRotatedImage(
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ): void {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    this.ctx.save();
    this.ctx.translate(Math.floor(centerX), Math.floor(centerY));
    this.ctx.rotate(rotation);
    this.ctx.drawImage(
      image,
      Math.floor(-width / 2),
      Math.floor(-height / 2),
      Math.floor(width),
      Math.floor(height)
    );
    this.ctx.restore();
  }

  /**
   * 绘制背景图片（平铺或拉伸）
   */
  drawBackground(image: HTMLImageElement, mode: 'stretch' | 'tile' = 'stretch'): void {
    if (mode === 'stretch') {
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    } else if (mode === 'tile') {
      const pattern = this.ctx.createPattern(image, 'repeat');
      if (pattern) {
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
}