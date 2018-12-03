import React, { Component } from 'react';
import { string } from 'prop-types';
import { Icon, Touchable }  from '../../components';
import { location } from '../../../utils';

class BackButton extends Component {
  static defaultProps = {
    testID: 'back-button',
  }

  static propTypes = {
    testID: string,
  }

  handleClick = () => {
    location.goBack();
  }

  render() {
    const { testID } = this.props;

    return (
      <Touchable
        withFeedback
        onPress={this.handleClick}
        testID={testID}
      >
        <Icon
          name="chevron-left"
          color="black"
          size="xl"
        />
      </Touchable>
    );
  }
}

export default BackButton;
