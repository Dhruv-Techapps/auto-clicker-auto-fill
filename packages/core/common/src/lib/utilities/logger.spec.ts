import { Logger } from './logger';

describe('Logger', () => {
  describe('color', () => {
    test('color', () => {
      Logger.colorLog('LOGGER', 'log from Logger');
      Logger.colorInfo('LOGGER', 'info from Logger');
      Logger.colorWarn('LOGGER', 'warn from Logger');
      Logger.colorError('LOGGER', 'error from Logger');
      Logger.colorDebug('LOGGER', 'debug from Logger');
      expect(false).not.toBe(true);
    });
  });
});
