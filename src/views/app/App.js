import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Platform } from 'react-native';
import { LayoutConsumer } from '../layout';
import Routing from '../routing';
import AuthenticatedApp from './authenticated';

class App extends Component {
  render() {
    return (
      <LayoutConsumer>
        {layout => (
          <SafeAreaView
            style={{
              flex: 1,
              marginTop: (
                Platform.OS === 'ios'
                  ? StatusBar.currentHeight
                  : 0
              ),
              backgroundColor: (
                Platform.OS === 'ios' ? layout.appColor : 'transparent'
              ),
            }}
          >
            <AuthenticatedApp>
              <Routing />
            </AuthenticatedApp>
          </SafeAreaView>
        )}
      </LayoutConsumer>
    );
  }
}

export default App;
