import React, { PureComponent } from 'react';
import { View, Switch as NativeSwitch } from 'react-native';
import { bool, func, string } from 'prop-types';

class Switch extends PureComponent {
  static defaultProps = {
    value: false,
    testID: 'input-switch',
  }

  static propTypes = {
    value: bool,
    onChange: func,
    onChangeValue: func,
    testID: string,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.value != null &&
      nextProps.value !== nextState.value
    ) {
      return { value: nextProps.value };
    }

    return null;
  }

  state = {
    value: this.props.value,
  }

  handleChangeValue = value => {
    this.setState({ value });

    if ( this.props.onChange )
      this.props.onChange({ target: { value } });

    if ( this.props.onChangeValue )
      this.props.onChangeValue( value );
  }

  render() {
    const { testID } = this.props;
    const { value } = this.state;

    return (
      <View testID={testID}>
        <NativeSwitch
          {...this.props}
          onValueChange={this.handleChangeValue}
          value={value}
        />
      </View>
    );
  }
}

export default Switch;
