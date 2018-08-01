import React, { Component } from 'react';
import { TabNavigator as ReactNavigationTabNavigator } from 'react-navigation';
import { object } from 'prop-types';
import { Heading } from '../../index';
// import { Generic } from '../../../pages';

class TabNavigator extends Component {
  static defaultProps = {
    config: {

    },
  }

  static propTypes = {
    config: object,
    // routes: object,
  }

  render() {
    const { config } = this.props;

    return ReactNavigationTabNavigator({
      genericTab: () => (
        <Heading>
          Hi
        </Heading>
      ),
    }, config );
  }
}

export default TabNavigator;
