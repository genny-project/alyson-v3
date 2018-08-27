export default {
  modifyBabelRc: config => {
    config.plugins = [
      'react-native-web',
      '@babel/transform-async-to-generator',
      '@babel/plugin-proposal-class-properties',
      ['@babel/transform-runtime', {
        regenerator: true,
      }],
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
