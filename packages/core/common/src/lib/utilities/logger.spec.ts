import { Logger, EnhancedLogger, ELoggingLevel, RingBuffer } from './logger';

describe('Logger', () => {
  describe('legacy color methods', () => {
    test('color methods work as before', () => {
      Logger.colorLog('LOGGER', 'log from Logger');
      Logger.colorInfo('LOGGER', 'info from Logger');
      Logger.colorWarn('LOGGER', 'warn from Logger');
      Logger.colorError('LOGGER', 'error from Logger');
      Logger.colorDebug('LOGGER', 'debug from Logger');
      expect(true).toBe(true);
    });
  });
});

describe('RingBuffer', () => {
  test('should store items up to capacity', () => {
    const buffer = new RingBuffer<number>(3);
    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    
    expect(buffer.getAll()).toEqual([1, 2, 3]);
    expect(buffer.getSize()).toBe(3);
  });

  test('should overwrite oldest items when capacity exceeded', () => {
    const buffer = new RingBuffer<number>(2);
    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    
    expect(buffer.getAll()).toEqual([2, 3]);
    expect(buffer.getSize()).toBe(2);
  });

  test('should clear buffer', () => {
    const buffer = new RingBuffer<number>(2);
    buffer.push(1);
    buffer.push(2);
    buffer.clear();
    
    expect(buffer.getAll()).toEqual([]);
    expect(buffer.getSize()).toBe(0);
  });
});

describe('EnhancedLogger', () => {
  let logger: EnhancedLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = EnhancedLogger.getInstance();
    logger.configure({
      level: ELoggingLevel.DEBUG,
      enableVerbose: true,
      useRingBuffer: true,
      ringBufferSize: 10
    });
    logger.clearRingBuffer();
    
    consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should be singleton', () => {
    const logger2 = EnhancedLogger.getInstance();
    expect(logger).toBe(logger2);
  });

  test('should configure logger settings', () => {
    logger.configure({
      level: ELoggingLevel.INFO,
      enableVerbose: false
    });

    const config = logger.getConfig();
    expect(config.level).toBe(ELoggingLevel.INFO);
    expect(config.enableVerbose).toBe(false);
  });

  test('should log messages with scopes', () => {
    logger.debug(['ACTION', '#1', 'test'], 'Debug message');
    
    const entries = logger.getRingBuffer();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(ELoggingLevel.DEBUG);
    expect(entries[0].scopes).toEqual(['ACTION', '#1', 'test']);
    expect(entries[0].message).toBe('Debug message');
  });

  test('should always log errors and warnings regardless of verbose setting', () => {
    logger.configure({ enableVerbose: false, level: ELoggingLevel.ERROR });
    
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    logger.error(['ERROR'], 'Error message');
    logger.warn(['WARN'], 'Warning message');
    logger.debug(['DEBUG'], 'Debug message');
    
    expect(errorSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
    
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('should respect verbose mode for debug messages', () => {
    logger.configure({ enableVerbose: false, level: ELoggingLevel.DEBUG });
    
    logger.debug(['DEBUG'], 'Debug message');
    expect(consoleSpy).not.toHaveBeenCalled();
    
    logger.configure({ enableVerbose: true });
    logger.debug(['DEBUG'], 'Debug message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('should store entries in ring buffer', () => {
    logger.debug(['TEST'], 'Message 1');
    logger.info(['TEST'], 'Message 2');
    
    const entries = logger.getRingBuffer();
    expect(entries).toHaveLength(2);
  });

  test('should clear ring buffer', () => {
    logger.debug(['TEST'], 'Message');
    expect(logger.getRingBuffer()).toHaveLength(1);
    
    logger.clearRingBuffer();
    expect(logger.getRingBuffer()).toHaveLength(0);
  });
});
