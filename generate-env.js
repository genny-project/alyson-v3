//
// This is for generating .envs from your system's environment variables.
// This is mostly for CI systems.
//
const fs = require( 'fs' );

const [project, environment] = process.argv.slice( 2, 4 );

const targetEnv = ( project && environment )
  ? `.env.${project}.${environment}`
  : '.env';

if ( fs.existsSync( targetEnv )) {
  // eslint-disable-next-line no-console
  console.log(
    `Attempting to generate ${targetEnv} file when it already exists. ` +
    `If you wish to generate a new .${targetEnv} from your system's environment variables, ` +
    `please remove the existing ${targetEnv}`
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
  'GUEST_USERNAME',
  'GUEST_PASSWORD',
];

const envOutput = targetVars
    .map( variable => `${variable}=${process.env[variable] || 'xxx'}` )
    .join( '\n' );

// eslint-disable-next-line no-console
console.log( envOutput );

fs.writeFile( targetEnv, envOutput, err => {
  if ( err ) {
    // eslint-disable-next-line no-console
    console.log({ err });

    return;
  }

  // eslint-disable-next-line no-console
  console.log( `succesfully generated blank ${targetEnv}` );
});
