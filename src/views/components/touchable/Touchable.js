import { PureComponent, createElement } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { node, bool, object, func } from 'prop-types';

class Touchable extends PureComponent {
  static propTypes = {
    children: node,
    withFeedback: bool,
    hoverProps: object,
    onMouseEnter: func,
    onMouseLeave: func,
  }

  state = {
    isHovering: false,
  }

  handleMouseEnter = event => {
    this.setState({ isHovering: true });

    if ( this.props.onMouseEnter )
      this.props.onMouseEnter( event );
  }

  handleMouseLeave = () => {
    this.setState({ isHovering: false });

    if ( this.props.onMouseLeave )
      this.props.onMouseLeave( event );
  }

  render() {
    const { withFeedback, children, hoverProps, ...restProps } = this.props;
    const { isHovering } = this.state;

    const element = (
      !withFeedback
        ? TouchableWithoutFeedback
        : TouchableOpacity
    );

    const props = {
      ...restProps,
      ...isHovering ? hoverProps : {},
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
    };

    return createElement(
      element,
      props,
      children
    );
  }
}

export default Touchable;
