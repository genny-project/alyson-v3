/* eslint no-console: 0 */

const hb = require( 'handlebars' );
const fs = require( 'fs-extra' );
const path = require( 'path' );

const envPath = process.argv[2] || '.env';

const walk = async ( dir, cb ) => {
  const files = await fs.readdir( dir );

  files.forEach( async file => {
    const filepath = path.join( dir, file );
    const details = await fs.stat( filepath );

    if ( details.isDirectory()) {
      walk( filepath, cb );
    } else if ( details.isFile()) {
      const generatedFile = await cb( filepath, details );
      // pull off the config-templates dir, so we write from the root of the project
      const newPath = filepath.substring( 17 );

      console.log( `writing ${filepath} to ${newPath}` );
      try {
        fs.writeFile( newPath, generatedFile );
      } catch ( e ) {
        console.log( `error writing file ${e}` );
      }
    }
  });
};

const fillTemplate = data =>
  async filepath => hb.compile( await fs.readFile( filepath, 'utf8' ))( data );

const getData = async () => {
  const data = await fs.readFile( envPath, 'utf8' );
  const lines = data.split( '\n' );

  return lines
    .map( line => line.split( '=' ))
    .reduce(( data, current ) => {
      if ( current[0].length ) {
        data[current[0].trim()] = current[1].trim();
      }

      return data;
    }, {});
};

getData()
  .then( data => walk( 'config-templates', fillTemplate( data )));

