require( 'dotenv/config' );
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const MonacoWebpackPlugin = require( 'monaco-editor-webpack-plugin' );
const Dotenv = require( 'dotenv-webpack' );
const common = require( './webpack.common.js' );

module.exports = env => merge( common, {
  plugins: [
    new MonacoWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.GENNY_HOST_URL': JSON.stringify( env.GENNY_HOST_URL ),
      'process.env.GENNY_INIT_URL': JSON.stringify( env.GENNY_INIT_URL ),
    }),
    new Dotenv({ path: './.env' }),
  ],
  devtool: 'eval',
});
