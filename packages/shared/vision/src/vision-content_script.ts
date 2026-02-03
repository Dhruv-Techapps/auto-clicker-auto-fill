import type { VisionImageRequest } from './lib/vision-types';

export class VisionValue {
  static isBase64Image(dataURL: string) {
    const regex = /^data:image\/(png|jpeg|jpg|gif|webp|bmp|svg\+xml|x-icon);base64,/;
    return regex.test(dataURL);
  }

  static extractBase64Data(dataURL: string) {
    // Split the data URL at the comma
    const base64Data = dataURL.split(',')[1];
    return base64Data;
  }

  static async getImageSrc(elements: Array<HTMLElement>): Promise<VisionImageRequest> {
    const element = elements[0];
    if (!element) {
      throw new Error('No element found');
    }
    let src;
    if (element.tagName === 'IMG' || element.tagName === 'IMAGE') {
      src = element.getAttribute('src');
    } else {
      // get background image from the element
      const style = window.getComputedStyle(element);
      const backgroundImage = style.backgroundImage;
      if (!backgroundImage || backgroundImage === 'none') {
        throw new Error('No background image found');
      }
      src = backgroundImage.slice(5, -2);
    }
    if (!src) {
      throw new Error('No image found');
    }

    let content = '';
    if (this.isBase64Image(src)) {
      content = this.extractBase64Data(src);
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (element instanceof HTMLImageElement) {
          canvas.width = element.naturalWidth;
          canvas.height = element.naturalHeight;
          ctx.drawImage(element, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          content = this.extractBase64Data(dataURL);
        } else if (element instanceof SVGImageElement) {
          const svg = element.ownerSVGElement;
          if (!svg) {
            throw new Error('No SVG owner found');
          }
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              URL.revokeObjectURL(url);
              resolve(true);
            };
            img.onerror = (e) => {
              URL.revokeObjectURL(url);
              reject(e);
            };
          });
          const dataURL = canvas.toDataURL('image/png');
          content = this.extractBase64Data(dataURL);
        }
      }
    }
    return { content, imageUri: '' };
  }
}
