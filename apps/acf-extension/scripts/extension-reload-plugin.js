/**
 * Webpack plugin for Chrome Extension Development Auto-Reload
 */

class ExtensionReloadPlugin {
  constructor(options = {}) {
    this.options = {
      port: 8080,
      ...options
    };
    this.reloader = null;
  }

  apply(compiler) {
    const ExtensionReloader = require('./reload-extension');
    
    // Only activate in development mode
    if (compiler.options.mode !== 'development' && process.env.NODE_ENV !== 'development') {
      return;
    }

    console.log('🔧 Extension Reload Plugin activated for development');

    // Start the reload server on compilation start
    compiler.hooks.watchRun.tapAsync('ExtensionReloadPlugin', (compilation, callback) => {
      if (!this.reloader) {
        this.reloader = new ExtensionReloader(this.options.port);
        this.reloader.start();
      }
      callback();
    });

    // Trigger reload after successful build
    compiler.hooks.afterEmit.tapAsync('ExtensionReloadPlugin', (compilation, callback) => {
      if (this.reloader && compilation.errors.length === 0) {
        // Small delay to ensure files are written
        setTimeout(() => {
          this.reloader.reload();
        }, 100);
      }
      callback();
    });

    // Clean up on exit
    process.on('SIGINT', () => {
      if (this.reloader) {
        this.reloader.stop();
      }
      process.exit();
    });

    process.on('SIGTERM', () => {
      if (this.reloader) {
        this.reloader.stop();
      }
      process.exit();
    });
  }
}

module.exports = ExtensionReloadPlugin;