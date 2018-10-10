//
// This is for generating .envs from your system's environment variables.
// This is mostly for CI systems.
//
const fs = require( 'fs' );

if ( fs.existsSync( '.env' )) {
  console.log(
    'Attempting to generate .env file when it already exists. ' +
    'If you wish to generate a new .env from your system\'s environment variables, ' +
    'please remove the existing .env'
  );

  return 0;
}

const targetVars = [
  'APP_NAME',
  'APP_ID',
  'GENNY_HOST',
  'GENNY_INITURL',
  'GENNY_BRIDGE_PORT',
  'GENNY_BRIDGE_VERTEX',
  'GENNY_BRIDGE_SERVICE',
  'GENNY_BRIDGE_EVENTS',
  'GOOGLE_MAPS_APIKEY',
  'GOOGLE_MAPS_APIURL',
  'UPPY_URL',
  'KEYCLOAK_REDIRECTURI',
  'LAYOUT_PUBLICURL',
  'LAYOUT_QUERY_DIRECTORY',
  'APPCENTER_ANDROID_SECRET',
  'APPCENTER_IOS_SECRET',
  'CODEPUSH_KEY',
  'IOS_CODEPUSH_KEY',
  'LAYOUT_QUERY_DIRECTORY',
  'GUEST_USERNAME',
  'GUEST_PASSWORD',
];

const envOutput = targetVars
    .map( variable => `${variable}=${process.env[variable] || 'xxx'}` )
    .join( '\n' );

console.log( envOutput );

fs.writeFile( '.env', envOutput );
