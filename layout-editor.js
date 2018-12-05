var express = require( 'express' );
var http = require( 'http' );
var socketio = require( 'socket.io' );
var fs = require( 'fs' );

var app = express();
var server = http.Server( app );
var websocket = socketio( server );

// eslint-disable-next-line no-console
server.listen( 6500, () => console.log( 'listening on *:6500' ));

// The event will be called when a client is connected.
websocket.on( 'connection', ( socket ) => {
  // eslint-disable-next-line no-console
  console.log( 'A client just joined on', socket.id );
  socket.on( 'code', message => {
    // eslint-disable-next-line no-console
    console.log( message );
    websocket.emit( 'code', message );
  });
});

app.get( '/editor', ( req, res ) => {
  res.end( fs.readFileSync( './editor.html' ).toString());
});
