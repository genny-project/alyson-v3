import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import Routing from '../routing';
import AuthenticatedApp from './authenticated';
import LayoutEditor from './layout-editor';
import { location } from '../../utils';

class App extends Component {
  constructor() {
    super();

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

  handleBackPress = () => {
    location.goBack();

    return true;
  };

  openLayoutEditor() {
    this.setState({ layoutEditorOpen: true });
  }

  render() {
    const { layoutEditorOpen } = this.state;

    console.log( 'RENDERING APP' );

    return (
      <AuthenticatedApp>
        { !layoutEditorOpen && <Routing /> }
        { layoutEditorOpen && <LayoutEditor /> }
      </AuthenticatedApp>
    );
  }
}

export default App;
