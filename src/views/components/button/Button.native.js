import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, object } from 'prop-types';
import { NavigationActions } from 'react-navigation';
import Button from './Button.js';

class ButtonNative extends Component {
  static propTypes = {
    onPress: func,
    navigation: object,
    dispatch: func,
    showSpinnerOnClick: bool,
  }

  state = {
    isSpinning: false,
  }

  componentDidUpdate( prevProps ) {
    if (
      this.state.isSpinning &&
      this.props.navigation.index !== prevProps.navigation.index
    ) {
      this.setState({ isSpinning: false }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  handlePress = event => {
    if ( this.props.showSpinnerOnClick )
      this.setState({ isSpinning: true });

    if ( this.props.onPress )
      this.props.onPress( event );
  }

  handleBack = () => {
    const { dispatch } = this.props;

    dispatch(
      NavigationActions.goBack()
    );
  }

  render() {
    const { isSpinning } = this.state;

    return (
      <Button
        {...this.props}
        isSpinning={isSpinning}
        onPress={this.handlePress}
        onBack={this.handleBack}
      />
    );
  }
}

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect( mapStateToProps )( ButtonNative );
