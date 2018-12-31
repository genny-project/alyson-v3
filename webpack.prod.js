// const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );

module.exports = merge( common, {
  plugins: [
    new webpack.IgnorePlugin( /react-monaco-editor$/ ),
    new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ),
    // new BundleAnalyzerPlugin(),
  ],
});
