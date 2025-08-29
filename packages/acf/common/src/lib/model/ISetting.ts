export enum ERetryOptions {
  STOP = 'stop',
  SKIP = 'skip',
  RELOAD = 'reload',
  GOTO = 'goto'
}

export interface ISettingsNotifications {
  onAction: boolean;
  onBatch: boolean;
  onConfig: boolean;
  onError: boolean;
  sound: boolean;
  discord: boolean;
}

export const defaultSettingsNotifications = {
  onAction: false,
  onBatch: false,
  onConfig: false,
  onError: false,
  sound: false,
  discord: false
};

export interface ISettingsBackup {
  autoBackup: 'daily' | 'weekly' | 'monthly' | 'off';
  lastBackup?: string;
}

export const defaultSettingsBackup = {
  autoBackup: 'off'
};

export enum ELoggingLevel {
  ERROR = 'error',
  WARN = 'warn', 
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

export enum EStatusBarMode {
  HIDE = 'hide',
  MINIMAL = 'minimal',
  FULL = 'full'
}

export interface ISettingsLogging {
  level: ELoggingLevel;
  enableVerbose: boolean;
  useRingBuffer: boolean;
  ringBufferSize: number;
}

export const defaultSettingsLogging: ISettingsLogging = {
  level: ELoggingLevel.WARN,
  enableVerbose: false,
  useRingBuffer: true,
  ringBufferSize: 500
};

export interface ISettings {
  retry: number;
  retryInterval: number | string;
  retryOption: ERetryOptions;
  checkiFrames: boolean;
  statusBar: 'hide' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  statusBarMode?: EStatusBarMode;
  enableStatusBar?: boolean;
  backup?: ISettingsBackup;
  reloadOnError?: boolean;
  notifications?: ISettingsNotifications;
  suppressWhatsNew?: boolean;
  logging?: ISettingsLogging;
}

export const defaultSettings: ISettings = {
  retry: 5,
  retryInterval: 1,
  statusBar: 'bottom-right',
  retryOption: ERetryOptions.STOP,
  checkiFrames: false,
  statusBarMode: EStatusBarMode.FULL,
  enableStatusBar: true,
  logging: defaultSettingsLogging
};

export interface IDiscord {
  accent_color: number;
  avatar: string;
  banner_color: string;
  discriminator: string;
  displayName?: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
  verified: boolean;
}

export interface IGoogleUser {
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
}
