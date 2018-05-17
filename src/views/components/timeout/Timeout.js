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
    this.secondsTimer = setInterval( this.incrementSecondsTimer, 1000 );
  }

  finishTimeout = () => {
    this.setState({ isTimeUp: true });

    this.clearTimeouts();
  }

  clearTimeouts() {
    if ( this.timeout != null )
      clearTimeout( this.timeout );

    if ( this.secondsTimer != null )
      clearTimeout( this.secondsTimer );
  }

  incrementSecondsTimer = () => {
    const { isTimeUp } = this.state;

    if ( isTimeUp ) {
      clearTimeout( this.secondsTimer );
    }
    else {
      this.setState( state => ({ secondsElapsed: state.secondsElapsed + 1 }));
    }
  }

  /* eslint-enable react/sort-comp */

  state = {
    isTimeUp: false,
    startTimeout: this.startTimeout,
    finishTimeout: this.finishTimeout,
    clearTimeouts: this.clearTimeouts,
    secondsElapsed: 0,
  }

  componentDidMount() {
    const { manuallyStartTimeout } = this.props;

    if ( !manuallyStartTimeout )
      this.startTimeout();
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  render() {
    return this.props.children({
      isTimeUp: this.state.isTimeUp,
      startTimeout: this.state.startTimeout,
      finishTimeout: this.state.finishTimeout,
      clearTimeouts: this.state.clearTimeouts,
      secondsElapsed: this.state.secondsElapsed,
    });
  }
}

export default Timeout;
