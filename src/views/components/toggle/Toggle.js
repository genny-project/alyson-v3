import { Component } from 'react';
import { bool, func } from 'prop-types';

class Toggle extends Component {
  static defaultProps = {
    isInitiallyToggled: false,
  }

  static propTypes = {
    children: func,
    isInitiallyToggled: bool,
  }

  /* eslint-disable react/sort-comp */

  handleToggle = () => {
    this.setState( state => ({ isToggled: !state.isToggled }));
  }

  /* eslint-enable react/sort-comp */

  state = {
    isToggled: this.props.isInitiallyToggled,
    handleToggle: this.handleToggle,
  }

  render() {
    const { children } = this.props;
    const { isToggled, handleToggle } = this.state;

    return children({
      isToggled,
      handleToggle,
    });
  }
}

export default Toggle;
