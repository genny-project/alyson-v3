import React, { Component } from 'react';
import Routing from '../routing';
import AuthenticatedApp from './authenticated';
import LayoutEditor from './layout-editor';

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

  openLayoutEditor() {
    this.setState({ layoutEditorOpen: true });
  }

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
