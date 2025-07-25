export interface DiscordMessagingType {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Array<{ name: string; value: any }>;
  color: string;
  variant?: string;
}

export enum DiscordMessagingColor {
  SUCCESS = '#198754',
  ERROR = '#dc3545'
}
