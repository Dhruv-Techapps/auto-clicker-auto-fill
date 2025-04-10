import { FirebaseFunctionsBackground } from '@dhruv-techapps/shared-firebase-functions';
import { OpenAIRequest, OpenAIResponse } from './openai.types';

export class OpenAIBackground extends FirebaseFunctionsBackground {
  async generateText({ content }: OpenAIRequest): Promise<string> {
    if (!content || content.trim().length === 0) {
      throw new Error('No prompt provided');
    }
    const data: OpenAIRequest = { content };
    const result = await this.openAiChat<OpenAIRequest, OpenAIResponse>(data);
    return result.content;
  }
}
