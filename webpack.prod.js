// const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
require( 'dotenv/config' );
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const Dotenv = require( 'dotenv-webpack' );

/**
 * Prefix each key in an object with `process.env`,
 * and set the value of each key to be stringified.
 *
 * @param {object} envVars
 */
function formatEnvironmentVariables( envVars ) {
  const keys = Object.keys( envVars );

  return keys.reduce(( result, key ) => {
    result[`process.env.${key}`] = JSON.stringify( envVars[key] );

    return result;
  }, {});
}

module.exports = env => {
  const plugins = [
    new Dotenv({ path: './.env' }),
  ];

  if ( env ) {
    const envVars = formatEnvironmentVariables( env );

    plugins.push(
      new webpack.DefinePlugin( envVars )
    );
  }

  return merge( common, {
    plugins,
  });
};
