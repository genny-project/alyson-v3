import { View, Switch as NativeSwitch } from 'react-native';
import React from 'react';

class Switch extends React.Component {
  state = {
    isOn: false,
  }

  handleOn = () => {
    this.setState({ isOn: true });
  }

  handleOff = () => {
    this.setState({ isOn: false });
  }

  handleSwitch = () => {
    this.setState( state => ({ isOn: !state.isOn }));
  }

  render() {
    return (
      <View>
        <NativeSwitch
          onValueChange={this.handleSwitch}
          style={{ marginBottom: 10 }}
          value={this.state.isOn}
        />
      </View>
    );
  }
}

export default Switch;
