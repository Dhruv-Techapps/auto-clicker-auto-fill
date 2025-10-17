import { LOCAL_STORAGE_KEY, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { MainWorldBackground, RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING } from '@dhruv-techapps/acf-main-world';
import { Runtime } from '@dhruv-techapps/core-extension';
import { DiscordMessagingBackground, RUNTIME_MESSAGE_DISCORD_MESSAGING } from '@dhruv-techapps/shared-discord-messaging';
import { DiscordOauth2Background, RUNTIME_MESSAGE_DISCORD_OAUTH } from '@dhruv-techapps/shared-discord-oauth';
import { FirebaseFirestoreBackground, RUNTIME_MESSAGE_FIREBASE_FIRESTORE } from '@dhruv-techapps/shared-firebase-firestore';
import { FirebaseFunctionsBackground, RUNTIME_MESSAGE_FIREBASE_FUNCTIONS } from '@dhruv-techapps/shared-firebase-functions';
import { FirebaseOauth2Background, RUNTIME_MESSAGE_FIREBASE_OAUTH } from '@dhruv-techapps/shared-firebase-oauth';
import { FirebaseStorageBackground, RUNTIME_MESSAGE_FIREBASE_STORAGE } from '@dhruv-techapps/shared-firebase-storage';
import { RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from '@dhruv-techapps/shared-google-analytics';
import { GoogleDriveBackground, RUNTIME_MESSAGE_GOOGLE_DRIVE } from '@dhruv-techapps/shared-google-drive';
import { GoogleOauth2Background, RUNTIME_MESSAGE_GOOGLE_OAUTH } from '@dhruv-techapps/shared-google-oauth';
import { GoogleSheetsBackground, RUNTIME_MESSAGE_GOOGLE_SHEETS } from '@dhruv-techapps/shared-google-sheets';
import { registerNotifications } from '@dhruv-techapps/shared-notifications';
import { OpenAIBackground, RUNTIME_MESSAGE_OPENAI } from '@dhruv-techapps/shared-openai';
import { RUNTIME_MESSAGE_VISION, VisionBackground } from '@dhruv-techapps/shared-vision';
import XMLHttpRequest from 'xhr-shim';
import { DISCORD_CLIENT_ID, EDGE_OAUTH_CLIENT_ID, FIREBASE_FUNCTIONS_URL, OPTIONS_PAGE_URL, VARIANT } from '../common/environments';
import { scope } from '../common/instrument';
import AcfBackup from './acf-backup';
import { AcfSchedule } from './acf-schedule';
import registerContextMenus from './context-menu';
import { auth } from './firebase';
import { googleAnalytics } from './google-analytics';
import { TabsMessenger } from './tab';
import './watch-url-change';

self['XMLHttpRequest'] = XMLHttpRequest;

try {
  scope.setTag('page', 'background');
  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener(() => {
    googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'action:onClicked' } });
    chrome.tabs.create({ url: OPTIONS_PAGE_URL });
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      const storageResult = await chrome.storage.local.get([LOCAL_STORAGE_KEY.CONFIGS]);
      if (!storageResult[LOCAL_STORAGE_KEY.CONFIGS]) {
        TabsMessenger.optionsTab({ url: OPTIONS_PAGE_URL });
      }
    } else {
      new AcfSchedule().check();
    } /* else if (details.reason === 'update') {
      const { action } = await chrome.runtime.getManifest();
      chrome.notifications.create(
        'update-notification',
        {
          type: 'basic',
          iconUrl: action.default_icon,
          title: '⚠ Important Update',
          message: `We've updated Action Condition & Addon Goto to use Action IDs instead of indexes. Review your settings to ensure compatibility.`,
          buttons: [{ title: 'Review Now' }, { title: `Ignore - I don't use these features` }],
          requireInteraction: true,
        },
        function () {
          chrome.notifications.onButtonClicked.addListener(function (notificationId, btnIdx) {
            if (notificationId === 'update-notification') {
              if (btnIdx === 0) {
                chrome.tabs.create({ url: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/discussions/521' });
              }
              chrome.notifications.clear(notificationId);
            }
          });
        }
      );
    }*/
  });

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
    [RUNTIME_MESSAGE_OPENAI]: new OpenAIBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID)
  };
  Runtime.onMessageExternal(onMessageListener);

  Runtime.onMessage(onMessageListener);
  Runtime.onConnect(onMessageListener);

  auth.authStateReady().then(() => {
    const clientId = auth.currentUser?.uid;
    if (clientId) {
      chrome.storage.local.set({ clientId });
      scope.setUser({ id: clientId });
    }
  });
} catch (error) {
  scope.captureException(error);
  console.error('background', error);
}

self.onunhandledrejection = async (event) => {
  scope.captureException(event.reason, { captureContext: { tags: { errorType: 'onunhandledrejection' } } });
};

self.onerror = async (...rest) => {
  scope.captureException({ ...rest }, { captureContext: { tags: { errorType: 'onerror' } } });
};
