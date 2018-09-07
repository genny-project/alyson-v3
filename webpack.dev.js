const merge = require( 'webpack-merge' );
const MonacoWebpackPlugin = require( 'monaco-editor-webpack-plugin' );
const common = require( './webpack.common.js' );

module.exports = merge( common, {
  plugins: [
    new MonacoWebpackPlugin(),
  ],
  devtool: 'eval',
});
