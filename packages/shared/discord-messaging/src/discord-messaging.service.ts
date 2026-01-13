import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_DISCORD_MESSAGING } from './lib/discord-messaging.constant';
export { DiscordMessagingColor } from './lib/discord-messaging.types';

export class DiscordMessagingService extends CoreService {
  static override trace = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async push(title: string, fields: Array<{ name: string; value: any }>, color = '#198754') {
    return await this.message({ messenger: RUNTIME_MESSAGE_DISCORD_MESSAGING, methodName: 'push', message: { title, fields, color } });
  }
}
