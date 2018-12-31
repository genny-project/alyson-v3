import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import Routing from '../routing';
import AuthenticatedApp from './authenticated';
import { location } from '../../utils';

/* Only include the LayoutEditor in dev */
let LayoutEditor = null;

if ( process.env.NODE_ENV !== 'production' ) {
  LayoutEditor = require( './layout-editor' );
}

class App extends Component {
  constructor( props ) {
    super( props );

    if ( window ) {
      window.App = this;
    }
  }

  state = {
    layoutEditorOpen: false,
  };

  componentDidMount() {
    if ( BackHandler )
      BackHandler.addEventListener( 'hardwareBackPress', this.handleBackPress );
  }

  componentWillUnmount() {
    if ( BackHandler )
      BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackPress );
  }

  openLayoutEditor() {
    this.setState({ layoutEditorOpen: true });
  }

  handleBackPress = () => {
    const currentLocation = location.getBasePath();

    const exitableRoutes = [
      '/home',
      '/splash',
    ];

    const exitOnBack = exitableRoutes.includes( currentLocation );

    if ( exitOnBack ) {
      BackHandler.exitApp();

      return true;
    }

    location.goBack();

    return true;
  };

  render() {
    const { layoutEditorOpen } = this.state;

    return (
      <AuthenticatedApp>
        { !layoutEditorOpen && <Routing /> }
        { layoutEditorOpen && <LayoutEditor /> }
      </AuthenticatedApp>
    );
  }
}

export default App;
