import { ContentScriptLogger } from './logger';
import { ELoggingLevel } from '@dhruv-techapps/core-common';

// Mock SettingsStorage
const mockGetSettings = jest.fn();
jest.mock('@dhruv-techapps/acf-store', () => ({
  SettingsStorage: jest.fn().mockImplementation(() => ({
    getSettings: mockGetSettings
  }))
}));

// Mock EnhancedLogger
const mockLogger = {
  configure: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(), 
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  getRingBuffer: jest.fn().mockReturnValue([]),
  clearRingBuffer: jest.fn()
};

const mockGetInstance = jest.fn().mockReturnValue(mockLogger);
jest.mock('@dhruv-techapps/core-common', () => ({
  ELoggingLevel: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4
  },
  EnhancedLogger: {
    getInstance: mockGetInstance
  }
}));

describe('ContentScriptLogger', () => {
  let logger: ContentScriptLogger;

  beforeEach(() => {
    logger = ContentScriptLogger.getInstance();
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    test('should return same instance', () => {
      const logger1 = ContentScriptLogger.getInstance();
      const logger2 = ContentScriptLogger.getInstance();
      expect(logger1).toBe(logger2);
    });
  });

  describe('Initialization', () => {
    test('should initialize with default settings when no settings found', async () => {
      mockGetSettings.mockResolvedValue({});
      
      await logger.initialize();
      
      expect(mockLogger.configure).toHaveBeenCalledWith({
        level: ELoggingLevel.WARN,
        enableVerbose: false,
        useRingBuffer: true,
        ringBufferSize: 500
      });
    });

    test('should initialize with user settings when available', async () => {
      mockGetSettings.mockResolvedValue({
        logging: {
          level: 'debug',
          enableVerbose: true,
          useRingBuffer: false,
          ringBufferSize: 100
        }
      });
      
      await logger.initialize();
      
      expect(mockLogger.configure).toHaveBeenCalledWith({
        level: ELoggingLevel.DEBUG,
        enableVerbose: true,
        useRingBuffer: false,
        ringBufferSize: 100
      });
    });

    test('should convert string log levels to numeric levels', async () => {
      const testCases = [
        { input: 'error', expected: ELoggingLevel.ERROR },
        { input: 'warn', expected: ELoggingLevel.WARN },
        { input: 'info', expected: ELoggingLevel.INFO },
        { input: 'debug', expected: ELoggingLevel.DEBUG },
        { input: 'trace', expected: ELoggingLevel.TRACE }
      ];

      for (const testCase of testCases) {
        mockGetSettings.mockResolvedValue({
          logging: { level: testCase.input, enableVerbose: false, useRingBuffer: true, ringBufferSize: 500 }
        });
        
        // Create new instance for each test
        const testLogger = new (ContentScriptLogger as any)();
        await testLogger.initialize();
        
        expect(mockLogger.configure).toHaveBeenCalledWith(
          expect.objectContaining({ level: testCase.expected })
        );
      }
    });

    test('should handle initialization errors gracefully', async () => {
      mockGetSettings.mockRejectedValue(new Error('Settings error'));
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await logger.initialize();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load logging settings, using defaults:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    test('should not initialize twice', async () => {
      mockGetSettings.mockResolvedValue({});
      
      await logger.initialize();
      await logger.initialize();
      
      expect(mockGetSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logging Methods', () => {
    beforeEach(async () => {
      mockGetSettings.mockResolvedValue({});
      await logger.initialize();
    });

    test('should delegate error calls to underlying logger', () => {
      logger.error(['TEST'], 'Error message', { data: 'test' });
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        ['TEST'],
        'Error message', 
        { data: 'test' }
      );
    });

    test('should delegate warn calls to underlying logger', () => {
      logger.warn(['TEST'], 'Warning message');
      
      expect(mockLogger.warn).toHaveBeenCalledWith(
        ['TEST'],
        'Warning message',
        undefined
      );
    });

    test('should delegate info calls to underlying logger', () => {
      logger.info(['CONFIG', 'LOAD'], 'Info message');
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        ['CONFIG', 'LOAD'],
        'Info message',
        undefined
      );
    });

    test('should delegate debug calls to underlying logger', () => {
      logger.debug(['ACTION', '#1'], 'Debug message');
      
      expect(mockLogger.debug).toHaveBeenCalledWith(
        ['ACTION', '#1'],
        'Debug message',
        undefined
      );
    });

    test('should delegate trace calls to underlying logger', () => {
      logger.trace(['DETAIL'], 'Trace message');
      
      expect(mockLogger.trace).toHaveBeenCalledWith(
        ['DETAIL'],
        'Trace message',
        undefined
      );
    });
  });

  describe('Ring Buffer Management', () => {
    beforeEach(async () => {
      mockGetSettings.mockResolvedValue({});
      await logger.initialize();
    });

    test('should get ring buffer from underlying logger', () => {
      const mockEntries = [
        { timestamp: Date.now(), level: 0, scopes: ['TEST'], message: 'Test' }
      ];
      mockLogger.getRingBuffer.mockReturnValue(mockEntries);
      
      const result = logger.getRingBuffer();
      
      expect(result).toBe(mockEntries);
      expect(mockLogger.getRingBuffer).toHaveBeenCalled();
    });

    test('should clear ring buffer on underlying logger', () => {
      logger.clearRingBuffer();
      
      expect(mockLogger.clearRingBuffer).toHaveBeenCalled();
    });
  });

  describe('Global Logger Instance', () => {
    test('should export logger instance', () => {
      const { logger: globalLogger } = require('./logger');
      
      expect(globalLogger).toBeInstanceOf(ContentScriptLogger);
    });
  });
});