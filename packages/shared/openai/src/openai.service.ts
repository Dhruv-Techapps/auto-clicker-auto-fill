import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_OPENAI } from './lib/openai.constant';
import type { OpenAIRequest } from './lib/openai.types';

export class OpenAIService extends CoreService {
  static override trace = true;
  static async generateText(message: OpenAIRequest): Promise<string> {
    return await this.message<RuntimeMessageRequest<OpenAIRequest>, string>({
      messenger: RUNTIME_MESSAGE_OPENAI,
      methodName: 'generateText',
      message: message
    });
  }
}
