import { FirebaseFunctionsBackground } from '@dhruv-techapps/shared-firebase-functions';
import { Auth } from '@dhruv-techapps/shared-firebase-oauth';
import { DiscordMessagingType } from './discord-messaging.types';

export class DiscordMessagingBackground extends FirebaseFunctionsBackground {
  constructor(
    auth: Auth,
    cloudFunctionUrl: string,
    edgeClientId?: string,
    private readonly VARIANT?: string
  ) {
    super(auth, cloudFunctionUrl, edgeClientId);
    this.VARIANT = VARIANT;
  }

  async push(data: DiscordMessagingType) {
    data.variant = this.VARIANT;
    await this.discordNotify<DiscordMessagingType, { error: string }>(data);
  }
}
