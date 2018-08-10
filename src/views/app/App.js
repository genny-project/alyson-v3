import React, { Component } from 'react';
import Routing from '../routing';
import AuthenticatedApp from './authenticated';

class App extends Component {
  render() {
    return (
      <AuthenticatedApp>
        <Routing />
      </AuthenticatedApp>
    );
  }
}

export default App;
