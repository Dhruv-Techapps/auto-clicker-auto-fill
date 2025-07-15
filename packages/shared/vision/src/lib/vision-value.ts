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
    let imageUri = '';
    if (this.isBase64Image(src)) {
      content = this.extractBase64Data(src);
    } else if (src.startsWith('https://') || src.startsWith('http://')) {
      imageUri = src;
    } else {
      imageUri = new URL(src, window.location.origin).href;
    }
    return { content, imageUri };
  }
}
