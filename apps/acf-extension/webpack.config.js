const { composePlugins, withNx } = require('@nx/webpack');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const { BannerPlugin } = require('webpack');
const fs = require('fs');
const ExtensionReloadPlugin = require('./scripts/extension-reload-plugin');

function modify(buffer, { KEY, VITE_PUBLIC_NAME, OAUTH_CLIENT_ID, VITE_PUBLIC_RELEASE_VERSION }) {
  // copy-webpack-plugin passes a buffer
  const manifest = JSON.parse(buffer.toString());
  // make any modifications you like, such as
  manifest.version = VITE_PUBLIC_RELEASE_VERSION.replace('v', '');
  manifest.name = VITE_PUBLIC_NAME;
  if (OAUTH_CLIENT_ID) {
    manifest.oauth2.client_id = OAUTH_CLIENT_ID;
  }
  if (KEY) {
    manifest.key = KEY;
  }

  return JSON.stringify(manifest, null, 2);
}

module.exports = composePlugins(
  // Default Nx composable plugin
  withNx(),
  // Custom composable plugin
  (config, { options }) => {
    // `config` is the Webpack configuration object
    // `options` is the options passed to the `@nx/webpack:webpack` executor
    // `context` is the context passed to the `@nx/webpack:webpack` executor
    // customize configuration here
    
    // Get environment information
    const isDevelopment = process.env.NODE_ENV === 'development' || options.env?.development;
    const isWatchMode = process.env.npm_lifecycle_event === 'serve' || process.argv.includes('--watch');
    
    config.output.clean = true;
    
    // Optimize for development vs production
    if (isDevelopment) {
      config.devtool = 'eval-cheap-module-source-map'; // Faster source maps for dev
      config.optimization = {
        ...config.optimization,
        minimize: false, // Disable minification in development
        splitChunks: false // Disable code splitting for simpler debugging
      };
      
      // Watch options for better development experience
      if (isWatchMode) {
        config.watchOptions = {
          poll: 1000, // Use polling for better file watching
          aggregateTimeout: 300, // Delay rebuild after file change
          ignored: /node_modules/ // Ignore node_modules for performance
        };
      }
    } else {
      config.devtool = 'source-map'; // Full source maps for production
    }
    config.entry = {
      background: './src/background/index.ts',
      content_scripts: './src/content_scripts/index.ts',
      content_scripts_main: './src/content_scripts_main/index.ts',
      wizard: './src/wizard/index.ts',
      'wizard-popup': ['./src/wizard/popup/wizard-popup.ts', './src/wizard/popup/wizard-popup.scss'],
      devtools: './src/devtools/index.ts',
      'status-bar': '../../packages/shared/status-bar/src/lib/status-bar.scss'
    };
    if (config.module.rules) {
      config.module.rules.push({
        test: /\.scss$/,
        use: [{ loader: 'file-loader', options: { publicPath: path.resolve(__dirname, 'dist'), outputPath: '/css', name: '[name].min.css' } }, 'sass-loader']
      });
      config.module.rules[2].options.cacheDirectory = path.resolve(options.root, 'node_modules/.cache/babel-loader');
    }

    const { VITE_PUBLIC_VARIANT } = process.env;
    const assets = VITE_PUBLIC_VARIANT === 'LOCAL' ? 'DEV' : VITE_PUBLIC_VARIANT;
    
    // Configure plugins
    const plugins = [
      new CopyPlugin({
        patterns: [
          { from: `**/messages.json`, to: './_locales', context: `${options.root}/apps/acf-i18n/src/locales` },
          { from: path.join(__dirname, 'assets', assets ?? 'DEV'), to: './assets' },
          { from: `./*.html`, to: './html', context: 'src/wizard/popup' },
          { from: `./*.html`, to: './', context: 'src/devtools' },
          { from: `./*.html`, to: './html', context: '../../packages/shared/sandbox/src/lib' },
          { from: path.join(options.root, './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'), to: './webcomponents' },
          {
            from: './src/manifest.json',
            to: './manifest.json',
            transform(content) {
              return modify(content, process.env);
            }
          }
        ]
      }),
      new Dotenv({
        path: `${options.root}/.env`,
        systemvars: true
      }),
      new BannerPlugin(fs.readFileSync(`${options.root}/LICENSE`, 'utf8'))
    ];
    
    // Add extension reload plugin for development
    if (isDevelopment) {
      plugins.push(new ExtensionReloadPlugin());
      console.log('🔧 Added Extension Reload Plugin for development watch mode');
    }
    
    config.plugins.push(...plugins);
    if (VITE_PUBLIC_VARIANT === 'PROD') {
      config.plugins.push(
        sentryWebpackPlugin({
          org: 'dhruv-techapps',
          project: 'acf-extension',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            name: process.env.VITE_PUBLIC_RELEASE_VERSION?.replace('v', '')
          },
          bundleSizeOptimizations: {
            excludeDebugStatements: true,
            // Only relevant if you added `browserTracingIntegration`
            excludePerformanceMonitoring: true,
            // Only relevant if you added `replayIntegration`
            excludeReplayIframe: true,
            excludeReplayShadowDom: true,
            excludeReplayWorker: true
          }
        })
      );
    }
    return config;
  }
);
