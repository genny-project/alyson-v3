import './index.css';
import App from '../src';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent( 'App', () => App );

AppRegistry.runApplication( 'App', {
  initialProps: {},
  rootTag: document.getElementById( 'root' ),
});
