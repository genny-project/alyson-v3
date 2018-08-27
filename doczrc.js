import { css } from 'docz-plugin-css';

export default {
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: true,
      loaderOpts: {
        /* whatever your preprocessor loader accept */
      },
    }),
  ],

  modifyBabelRc: config => {
    config.plugins = [
      'react-native-web',
      '@babel/transform-async-to-generator',
      '@babel/plugin-proposal-class-properties',
      ['@babel/transform-runtime', {
        regenerator: true,
      }],
      '@babel/plugin-syntax-dynamic-import',
    ];

    config.presets = [
      'react-native',
      '@babel/preset-react',
      '@babel/preset-env',
      'module:react-native-dotenv',
    ];

    return config;
  },
};
