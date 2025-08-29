import { EnhancedStatusBar, EStatusBarMode, STATUS_BAR_TYPE } from './status-bar';

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = jest.fn((callback) => {
  callback(0);
  return 0;
});

// Mock DOM methods
Object.defineProperty(document, 'body', {
  value: {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  },
  writable: true
});

describe('EnhancedStatusBar', () => {
  let statusBar: EnhancedStatusBar;
  let createElementSpy: jest.SpyInstance;

  beforeEach(() => {
    statusBar = new EnhancedStatusBar();
    createElementSpy = jest.spyOn(document, 'createElement');
    jest.clearAllMocks();
  });

  afterEach(() => {
    createElementSpy.mockRestore();
  });

  describe('Configuration', () => {
    test('should configure settings', () => {
      statusBar.configure({
        enabled: false,
        mode: EStatusBarMode.MINIMAL,
        location: 'top-left'
      });

      // Should not create DOM elements when disabled
      statusBar.actionUpdate(1, 'test');
      expect(createElementSpy).not.toHaveBeenCalled();
    });

    test('should enable status bar by default', () => {
      statusBar.actionUpdate(1, 'test');
      expect(createElementSpy).toHaveBeenCalled();
    });
  });

  describe('Lazy Initialization', () => {
    test('should not create DOM elements until first update', () => {
      const statusBar = new EnhancedStatusBar();
      expect(createElementSpy).not.toHaveBeenCalled();
    });

    test('should create DOM elements on first update when enabled', () => {
      statusBar.actionUpdate(1, 'test');
      expect(createElementSpy).toHaveBeenCalledWith('div');
    });

    test('should not create DOM elements when disabled', () => {
      statusBar.configure({ enabled: false });
      statusBar.actionUpdate(1, 'test');
      expect(createElementSpy).not.toHaveBeenCalled();
    });
  });

  describe('Update Batching', () => {
    test('should batch multiple updates in single requestAnimationFrame', () => {
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
      
      statusBar.actionUpdate(1, 'action1');
      statusBar.batchUpdate(2);
      statusBar.actionUpdate(3, 'action3');
      
      // Should only call rAF once for batched updates
      expect(rafSpy).toHaveBeenCalledTimes(1);
      
      rafSpy.mockRestore();
    });

    test('should apply all pending updates when flushed', () => {
      const mockDiv = {
        id: '',
        className: '',
        style: { cssText: '' },
        appendChild: jest.fn(),
        parentNode: null
      };
      const mockSpan = {
        textContent: '',
        title: '',
        className: ''
      };

      createElementSpy.mockImplementation((tag) => {
        if (tag === 'div') return mockDiv;
        if (tag === 'span') return mockSpan;
        return {};
      });

      statusBar.configure({ mode: EStatusBarMode.FULL });
      statusBar.actionUpdate(1, 'test action');
      
      expect(mockSpan.textContent).toBe('🅰️1');
      expect(mockSpan.title).toBe('test action');
    });
  });

  describe('Minimal Mode', () => {
    test('should create minimal UI in minimal mode', () => {
      const mockDiv = {
        id: '',
        className: '',
        style: { cssText: '' },
        appendChild: jest.fn(),
        parentNode: null
      };
      const mockSpan = {
        textContent: '',
        className: ''
      };

      createElementSpy.mockImplementation((tag) => {
        if (tag === 'div') return mockDiv;
        if (tag === 'span') return mockSpan;
        return {};
      });

      statusBar.configure({ mode: EStatusBarMode.MINIMAL });
      statusBar.actionUpdate(1, 'test');

      expect(mockDiv.style.cssText).toContain('position: fixed');
      expect(mockDiv.style.cssText).toContain('width: 40px');
      expect(mockDiv.style.cssText).toContain('pointer-events: none');
    });

    test('should show simplified content in minimal mode', () => {
      const mockDiv = {
        id: '',
        className: '',
        style: { cssText: '' },
        appendChild: jest.fn(),
        parentNode: null
      };
      const mockSpan = {
        textContent: '',
        className: ''
      };

      createElementSpy.mockImplementation((tag) => {
        if (tag === 'div') return mockDiv;
        if (tag === 'span') return mockSpan;
        return {};
      });

      statusBar.configure({ mode: EStatusBarMode.MINIMAL });
      statusBar.actionUpdate(5, 'test');
      
      expect(mockSpan.textContent).toBe('5');
    });
  });

  describe('Full Mode', () => {
    test('should create full UI elements in full mode', () => {
      statusBar.configure({ mode: EStatusBarMode.FULL });
      statusBar.actionUpdate(1, 'test');
      
      // Should create div + 6 spans (icon, text, batch, action, addon, timer)
      expect(createElementSpy).toHaveBeenCalledWith('div');
      expect(createElementSpy).toHaveBeenCalledWith('span');
      expect(createElementSpy).toHaveBeenCalledTimes(7); // 1 div + 6 spans
    });
  });

  describe('Wait Functionality', () => {
    test('should not wait when disabled', async () => {
      statusBar.configure({ enabled: false });
      
      const startTime = Date.now();
      await statusBar.wait(100); // 100ms wait
      const endTime = Date.now();
      
      // Should return immediately when disabled
      expect(endTime - startTime).toBeLessThan(50);
    });

    test('should wait for specified time when enabled', async () => {
      // Mock Timer.getWaitTime to return a short wait time
      jest.doMock('@dhruv-techapps/shared-util', () => ({
        Timer: {
          getWaitTime: jest.fn().mockReturnValue(10), // 10ms
          sleep: jest.fn().mockResolvedValue(undefined)
        }
      }));

      const { Timer } = require('@dhruv-techapps/shared-util');
      
      await statusBar.wait(10);
      expect(Timer.sleep).toHaveBeenCalledWith(10);
    });

    test('should update timer text during wait', async () => {
      const mockSpan = {
        textContent: '',
        className: 'timer'
      };
      
      createElementSpy.mockImplementation((tag) => {
        if (tag === 'span') return mockSpan;
        return { appendChild: jest.fn(), id: '', className: '', style: { cssText: '' } };
      });

      // Mock Timer methods
      jest.doMock('@dhruv-techapps/shared-util', () => ({
        Timer: {
          getWaitTime: jest.fn().mockReturnValue(1000), // 1 second
          sleep: jest.fn().mockResolvedValue(undefined)
        }
      }));

      statusBar.configure({ mode: EStatusBarMode.FULL });
      await statusBar.wait(1000, STATUS_BAR_TYPE.ACTION_WAIT, 'test');
      
      // Timer text should be cleared after wait
      expect(mockSpan.textContent).toBe('');
    });
  });

  describe('Error and Done States', () => {
    test('should show error state', () => {
      const mockSpan = {
        textContent: '',
        className: 'icon'
      };
      
      createElementSpy.mockImplementation((tag) => {
        if (tag === 'span') return mockSpan;
        return { appendChild: jest.fn(), id: '', className: '', style: { cssText: '' } };
      });

      statusBar.error('Test error');
      expect(mockSpan.textContent).toBe('❌');
    });

    test('should show done state', () => {
      const mockSpan = {
        textContent: '',
        className: 'icon'
      };
      
      createElementSpy.mockImplementation((tag) => {
        if (tag === 'span') return mockSpan;
        return { appendChild: jest.fn(), id: '', className: '', style: { cssText: '' } };
      });

      statusBar.done();
      expect(mockSpan.textContent).toBe('✨');
    });

    test('should not show error/done when disabled', () => {
      statusBar.configure({ enabled: false });
      
      statusBar.error('Test error');
      statusBar.done();
      
      expect(createElementSpy).not.toHaveBeenCalled();
    });
  });

  describe('Location Setting', () => {
    test('should set status bar location', async () => {
      const mockDiv = {
        id: '',
        className: '',
        style: { cssText: '' },
        appendChild: jest.fn(),
        parentNode: null
      };
      
      createElementSpy.mockImplementation(() => mockDiv);
      
      await statusBar.setLocation('top-left');
      statusBar.actionUpdate(1, 'test'); // Trigger initialization
      
      expect(mockDiv.className).toBe('top-left');
    });

    test('should handle hide location', async () => {
      const mockDiv = {
        id: '',
        className: '',
        style: { cssText: '' },
        appendChild: jest.fn(),
        parentNode: null
      };
      
      createElementSpy.mockImplementation(() => mockDiv);
      
      await statusBar.setLocation('hide');
      statusBar.actionUpdate(1, 'test');
      
      expect(mockDiv.className).toBe('hide');
    });
  });
});