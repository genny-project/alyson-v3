import { PureComponent, createElement } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, TouchableWithNativeFeedback, Platform } from 'react-native';
import { node, bool } from 'prop-types';

class Touchable extends PureComponent {
  static propTypes = {
    children: node,
    withFeedback: bool,
  }

  render() {
    const { withFeedback, children, ...restProps } = this.props;

    const element = (
      !withFeedback
        ? TouchableWithoutFeedback
        : Platform.OS === 'android'
          ? TouchableWithNativeFeedback
          : TouchableOpacity
    );

    return createElement(
      element,
      restProps,
      children
    );
  }
}

export default Touchable;
