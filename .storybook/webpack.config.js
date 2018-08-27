// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path');
const webpack = require('webpack');

module.exports = storybookBaseConfig => {
  storybookBaseConfig.module.rules.push({
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
      loader: 'url-loader',
      options: { name: '[name].[ext]' }
    }
  });

  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
    ],
  });

  storybookBaseConfig.resolve.extensions = ['.web.js', '.js', '.json', '.web.jsx', '.jsx'];

  storybookBaseConfig.resolve.alias = {
    'react-native': 'react-native-web'
  };

  return storybookBaseConfig;
};
