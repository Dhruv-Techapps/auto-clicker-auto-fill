const { composePlugins, withNx } = require('@nx/webpack');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const { BannerPlugin } = require('webpack');
const fs = require('fs');

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
    config.output.clean = true;
    config.devtool = 'source-map';
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
    config.plugins.push(
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
    );
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
