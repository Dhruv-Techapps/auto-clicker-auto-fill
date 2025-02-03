import { VisionImageRequest } from './vision-types';

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

  static getImageSrc(elements: Array<HTMLElement>): VisionImageRequest {
    const element = elements[0];
    if (!element) {
      throw new Error('No element found');
    }
    if (element.tagName !== 'IMG') {
      throw new Error('Element is not an image');
    }
    const src = element.getAttribute('src');
    if (!src) {
      throw new Error('No image found');
    }
    let content = '';
    let imageUri = '';
    if (this.isBase64Image(src)) {
      content = this.extractBase64Data(src);
    } else {
      // If the src is already a full URL, return it
      if (src.startsWith('https://') || src.startsWith('http://')) {
        imageUri = src;
      } else {
        imageUri = new URL(src, window.location.origin).href;
      }
    }
    return { content, imageUri };
  }
}
