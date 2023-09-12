const { composePlugins, withNx } = require('@nx/webpack');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const PACKAGE = require('../../package.json');
const path = require('path');
function modify(buffer, version, { KEY, NAME, OAUTH }) {
  // copy-webpack-plugin passes a buffer
  const manifest = JSON.parse(buffer.toString());

  // make any modifications you like, such as
  manifest.version = version;
  manifest.name = NAME;
  if (OAUTH) {
    manifest.oauth2.client_id = OAUTH;
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
      'sass-loader',
    ],
  });

  config.plugins[1] = new CopyPlugin({
    patterns: [
      { from: `**/messages.json`, to: './_locales', context: `${ctx.options.root}/apps/acf-i18n/src/locales` },
      { from: path.join(__dirname, 'assets', process.env.VARIANT || 'DEV'), to: './assets' },
      { from: `./*.html`, to: './html', context: 'src/wizard/popup' },
      { from: `./*.html`, to: './html', context: 'src/sandbox' },
      { from: path.join(ctx.options.root, './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'), to: './node_modules' },
      {
        from: './src/manifest.json',
        to: './manifest.json',
        transform(content) {
          return modify(content, PACKAGE.version, process.env);
        },
      },
    ],
  });
  config.plugins.push(
    new Dotenv({
      path: config.watch ? path.resolve(config.context, '.env') : './.env',
      systemvars: true,
    })
  );
  return config;
});
