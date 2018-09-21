import React, { Component } from 'react';

import { Icon, Touchable }  from '../../components';
import { location } from '../../../utils';

class BackButton extends Component {
  handleClick = () => {
    location.goBack();
  }

  render() {
    return (
      <Touchable
        withFeedback
        onPress={this.handleClick}
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
