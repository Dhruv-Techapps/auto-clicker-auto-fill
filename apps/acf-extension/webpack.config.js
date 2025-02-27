/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports  */
const { composePlugins, withNx } = require('@nx/webpack');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const { BannerPlugin } = require('webpack');
const fs = require('fs');

function modify(buffer, { KEY, NX_PUBLIC_NAME, OAUTH_CLIENT_ID, NX_PUBLIC_RELEASE_VERSION }) {
  // copy-webpack-plugin passes a buffer
  const manifest = JSON.parse(buffer.toString());
  // make any modifications you like, such as
  manifest.version = NX_PUBLIC_RELEASE_VERSION.replace('v', '');
  manifest.name = NX_PUBLIC_NAME;
  if (OAUTH_CLIENT_ID) {
    manifest.oauth2.client_id = OAUTH_CLIENT_ID;
  }
  if (KEY) {
    manifest.key = KEY;
  }

  return JSON.stringify(manifest, null, 2);
}

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config, ctx) => {
  // Update the webpack config as needed here.
  config.entry.styles = ctx.options.styles;
  config.module.rules.push({
    test: /\.scss$/i,
    use: [
      {
        loader: 'file-loader',
        options: { publicPath: path.resolve(__dirname, 'dist'), outputPath: '/css', name: '[name].min.css' },
      },
      {
        loader: 'sass-loader',
        options: {
          api: 'modern',
        },
      },
    ],
  });

  config.plugins[1] = new CopyPlugin({
    patterns: [
      { from: `**/messages.json`, to: './_locales', context: `${ctx.options.root}/apps/acf-i18n/src/locales` },
      { from: path.join(__dirname, 'assets', config.watch ? 'DEV' : process.env.NX_PUBLIC_VARIANT), to: './assets' },
      { from: `./*.html`, to: './html', context: 'src/wizard/popup' },
      { from: `./*.html`, to: './', context: 'src/devtools' },
      { from: `./*.html`, to: './html', context: '../../libs/shared/sandbox/src/lib' },
      { from: path.join(ctx.options.root, './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'), to: './webcomponents' },
      {
        from: './src/manifest.json',
        to: './manifest.json',
        transform(content) {
          return modify(content, process.env);
        },
      },
    ],
  });

  config.plugins.push(
    new Dotenv({
      path: './.env',
      systemvars: true,
    }),
    new BannerPlugin(fs.readFileSync('./LICENSE', 'utf8'))
  );

  if (process.env.NX_PUBLIC_VARIANT === 'PROD') {
    config.plugins.push(
      sentryWebpackPlugin({
        org: 'dhruv-techapps',
        project: 'acf-extension',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: {
          name: process.env.NX_PUBLIC_RELEASE_VERSION?.replace('v', ''),
        },
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          // Only relevant if you added `browserTracingIntegration`
          excludePerformanceMonitoring: true,
          // Only relevant if you added `replayIntegration`
          excludeReplayIframe: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
        },
      })
    );
  }
  return config;
});
