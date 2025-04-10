import { FirebaseFunctionsBackground } from '@dhruv-techapps/shared-firebase-functions';
import { VisionImageRequest, VisionImageResponse } from './vision-types';

export class VisionBackground extends FirebaseFunctionsBackground {
  async imagesAnnotate({ content, imageUri }: VisionImageRequest): Promise<string> {
    if (!content && !imageUri) {
      throw new Error('No image data found');
    }
    const data: VisionImageRequest = { content, imageUri };
    const result = await this.visionImagesAnnotate<VisionImageRequest, VisionImageResponse>(data);
    return result.responses[0].fullTextAnnotation.text;
  }
}
