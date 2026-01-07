import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { MainWorldBackground, RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING } from '@dhruv-techapps/acf-main-world';
import { Runtime } from '@dhruv-techapps/core-extension';
import '@dhruv-techapps/core-open-telemetry/background';
import { handleError, Logger, OpenTelemetryBackground, RUNTIME_MESSENGER_OPEN_TELEMETRY, SpanKind, trace, tracer } from '@dhruv-techapps/core-open-telemetry/background';
import { UserStorage } from '@dhruv-techapps/core-store';
import { DiscordMessagingBackground, RUNTIME_MESSAGE_DISCORD_MESSAGING } from '@dhruv-techapps/shared-discord-messaging/background';
import { DiscordOauth2Background, RUNTIME_MESSAGE_DISCORD_OAUTH } from '@dhruv-techapps/shared-discord-oauth/background';
import { FirebaseFirestoreBackground, RUNTIME_MESSAGE_FIREBASE_FIRESTORE } from '@dhruv-techapps/shared-firebase-firestore/background';
import { FirebaseFunctionsBackground, RUNTIME_MESSAGE_FIREBASE_FUNCTIONS } from '@dhruv-techapps/shared-firebase-functions/background';
import { FirebaseOauth2Background, RUNTIME_MESSAGE_FIREBASE_OAUTH } from '@dhruv-techapps/shared-firebase-oauth/background';
import { FirebaseStorageBackground, RUNTIME_MESSAGE_FIREBASE_STORAGE } from '@dhruv-techapps/shared-firebase-storage/background';
import { RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from '@dhruv-techapps/shared-google-analytics/background';
import { GoogleDriveBackground, RUNTIME_MESSAGE_GOOGLE_DRIVE } from '@dhruv-techapps/shared-google-drive/background';
import { GoogleOauth2Background, RUNTIME_MESSAGE_GOOGLE_OAUTH } from '@dhruv-techapps/shared-google-oauth/background';
import { GoogleSheetsBackground, RUNTIME_MESSAGE_GOOGLE_SHEETS } from '@dhruv-techapps/shared-google-sheets/background';
import { registerNotifications } from '@dhruv-techapps/shared-notifications/register';
import { OpenAIBackground, RUNTIME_MESSAGE_OPENAI } from '@dhruv-techapps/shared-openai/background';
import { RUNTIME_MESSAGE_VISION, VisionBackground } from '@dhruv-techapps/shared-vision/background';
import XMLHttpRequest from 'xhr-shim';
import { DISCORD_CLIENT_ID, EDGE_OAUTH_CLIENT_ID, FIREBASE_FUNCTIONS_URL, OPTIONS_PAGE_URL, VARIANT } from '../common/environments';
import AcfBackup from './acf-backup';
import { AcfSchedule } from './acf-schedule';
import './chrome/action.onClicked';
import './chrome/runtime.onInstalled';
import './commands';
import registerContextMenus from './context-menu';
import { auth } from './firebase';
import { googleAnalytics } from './google-analytics';
import { TabsMessenger } from './tab';
import './watch-url-change';
self['XMLHttpRequest'] = XMLHttpRequest;

tracer.startActiveSpan(
  'background-script-main',
  {
    root: true,
    kind: SpanKind.CONSUMER
  },
  (span) => {
    try {
      /**
       * Set Context Menu for right click
       */
      registerContextMenus(OPTIONS_PAGE_URL, googleAnalytics);

      /**
       * Set Notifications
       */
      registerNotifications(OPTIONS_PAGE_URL);

      /**
       * Setup on Message Listener
       */
      const onMessageListener = {
        [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
        [RUNTIME_MESSAGE_ACF.ACF_CONFIG_SCHEDULE]: new AcfSchedule(),
        [RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING]: new MainWorldBackground(),
        [RUNTIME_MESSAGE_DISCORD_OAUTH]: new DiscordOauth2Background(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID, DISCORD_CLIENT_ID),
        [RUNTIME_MESSAGE_DISCORD_MESSAGING]: new DiscordMessagingBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID, VARIANT),
        [RUNTIME_MESSAGE_GOOGLE_ANALYTICS]: googleAnalytics,
        [RUNTIME_MESSAGE_GOOGLE_OAUTH]: new GoogleOauth2Background(EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_GOOGLE_DRIVE]: new GoogleDriveBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_ACF.ACF_BACKUP]: new AcfBackup(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_GOOGLE_SHEETS]: new GoogleSheetsBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_FIREBASE_OAUTH]: new FirebaseOauth2Background(auth, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_FIREBASE_FIRESTORE]: new FirebaseFirestoreBackground(auth, EDGE_OAUTH_CLIENT_ID, OPTIONS_PAGE_URL),
        [RUNTIME_MESSAGE_FIREBASE_FUNCTIONS]: new FirebaseFunctionsBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_FIREBASE_STORAGE]: new FirebaseStorageBackground(auth, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_VISION]: new VisionBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSAGE_OPENAI]: new OpenAIBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
        [RUNTIME_MESSENGER_OPEN_TELEMETRY]: new OpenTelemetryBackground()
      };
      Runtime.onMessageExternal(onMessageListener);
      Runtime.onMessage(onMessageListener);

      auth.authStateReady().then(() => {
        const userId = auth.currentUser?.uid;
        if (userId) {
          UserStorage.setUserId(userId);
          Logger.info('auth.authStateReady', {
            message: 'User authenticated',
            userId: userId
          });
          trace.getActiveSpan()?.setAttribute('user.id', userId);
        }
      });
      Logger.debug('background-script-initialized', {
        message: 'Background script initialized successfully'
      });
    } catch (error) {
      handleError(span, error, 'Background Script Error');
    } finally {
      span.end();
    }
  }
);
