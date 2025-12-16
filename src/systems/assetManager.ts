/**
 * 资源管理器 - 处理图片和其他资源的加载
 */
export class AssetManager {
  private images: Map<string, HTMLImageElement> = new Map();
  private loadPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  /**
   * 加载图片
   */
  async loadImage(name: string, src: string): Promise<HTMLImageElement> {
    // 如果已经加载过，直接返回
    if (this.images.has(name)) {
      return this.images.get(name)!;
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadPromises.has(name)) {
      return this.loadPromises.get(name)!;
    }

    // 创建新的加载Promise
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.images.set(name, img);
        this.loadPromises.delete(name);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadPromises.delete(name);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });

    this.loadPromises.set(name, loadPromise);
    return loadPromise;
  }

  /**
   * 获取已加载的图片
   */
  getImage(name: string): HTMLImageElement | null {
    return this.images.get(name) || null;
  }

  /**
   * 检查图片是否已加载
   */
  hasImage(name: string): boolean {
    return this.images.has(name);
  }

  /**
   * 批量加载图片
   */
  async loadImages(imageMap: Record<string, string>): Promise<void> {
    const loadPromises = Object.entries(imageMap).map(([name, src]) => 
      this.loadImage(name, src)
    );
    
    await Promise.all(loadPromises);
  }

  /**
   * 创建像素艺术风格的图片（如果没有提供图片文件）
   */
  createPixelArtImage(name: string, width: number, height: number, drawFunction: (ctx: CanvasRenderingContext2D) => void): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    
    drawFunction(ctx);
    
    const img = new Image();
    img.src = canvas.toDataURL();
    this.images.set(name, img);
    
    return img;
  }

  /**
   * 清空所有资源
   */
  clear(): void {
    this.images.clear();
    this.loadPromises.clear();
  }
}

// 全局资源管理器实例
export const assetManager = new AssetManager();