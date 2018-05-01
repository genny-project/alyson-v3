import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Platform } from 'react-native';
import { LayoutConsumer } from '../layout';
import Routing from '../routing';

class App extends Component {
  render() {
    return (
      <LayoutConsumer>
        {layout => (
          <SafeAreaView
            style={{
              flex: 1,
              marginTop: StatusBar.currentHeight,
              backgroundColor: (
                Platform.OS === 'ios' ? layout.appColor : 'transparent'
              ),
            }}
          >
            <Routing />
          </SafeAreaView>
        )}
      </LayoutConsumer>
    );
  }
}

export default App;
