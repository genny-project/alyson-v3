import { Linking } from 'react-native';

class Url {
  constructor( url ) {
    this.url = url;
  }

  addEventListener( event, callback ) {
    Linking.addEventListener( event, callback );

    return this;
  }

  removeEventListener( event, callback ) {
    Linking.removeEventListener( event, callback );

    return this;
  }

  canOpen() {
    return Linking.canOpenURL( this.url );
  }

  open() {
    return Linking.openURL( this.url );
  }

  close() {}

  getUrl() {
    return this.url;
  }

  append( string ) {
    this.url += string;

    return this;
  }
}

export default Url;
