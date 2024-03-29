/*
  Incredibly simple Node.js and Express application server for serving static assets.
  Given as an example from the React Router documentation (along with examples
  using nginx and Apache):
  - https://github.com/ReactTraining/react-router/blob/master/docs/guides/Histories.md#browserhistory
*/

const express = require( 'express' );
const path = require( 'path' );

const port = process.env.PORT || 8080;
const app = express();

// serve static assets normally
app.use( express.static( `${__dirname}/dist` ));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).

app.get( '/version', ( req, res ) => {
  return res.sendFile( path.resolve( `${__dirname}/dist`, 'version.html' ));
});

app.get( '*', ( request, response ) => {
  return response.sendFile( path.resolve( `${__dirname}/dist`, 'index.html' ));
});

// app.get( '/', ( req, res ) => {
//   return res.sendFile( path.resolve( `${__dirname}/dist`, 'index.html' ));
// });

app.listen( port );
console.log(`server started on port ${port}`); //eslint-disable-line
