import { AppRegistry } from 'react-native';
import App from '../src';
import './index.css';

AppRegistry.registerComponent( 'App', () => App );

AppRegistry.runApplication( 'App', {
  initialProps: {},
  rootTag: document.getElementById( 'root' ),
});
