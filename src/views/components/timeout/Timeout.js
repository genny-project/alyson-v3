import { Component } from 'react';
import { number, bool, func } from 'prop-types';

class Timeout extends Component {
  static defaultProps = {
    duration: 1000,
  }

  static propTypes = {
    duration: number,
    manuallyStartTimeout: bool,
    children: func,
  }

  /* eslint-disable react/sort-comp */

  startTimeout = () => {
    const { duration } = this.props;

    this.timeout = setTimeout( this.finishTimeout, duration );
  }

  finishTimeout = () => {
    this.setState({ isTimeUp: true });

    this.clearTimeout();
  }

  clearTimeout() {
    if ( this.timeout != null )
      clearTimeout( this.timeout );
  }

  /* eslint-enable react/sort-comp */

  state = {
    isTimeUp: false,
    startTimeout: this.startTimeout,
    finishTimeout: this.finishTimeout,
    clearTimeout: this.clearTimeout,
  }

  componentDidMount() {
    const { manuallyStartTimeout } = this.props;

    if ( !manuallyStartTimeout )
      this.startTimeout();
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  render() {
    return this.props.children({
      isTimeUp: this.state.isTimeUp,
      startTimeout: this.state.startTimeout,
      finishTimeout: this.state.finishTimeout,
      clearTimeout: this.state.clearTimeout,
    });
  }
}

export default Timeout;
