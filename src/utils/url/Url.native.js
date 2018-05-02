import { Linking } from 'react-native';
import { WebBrowser } from 'expo';

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

  open() {
    return WebBrowser.openBrowserAsync( this.url );
  }

  close() {
    return WebBrowser.dismissBrowser();
  }

  getUrl() {
    return this.url;
  }

  append( string ) {
    this.url += string;

    return this;
  }
}

export default Url;
