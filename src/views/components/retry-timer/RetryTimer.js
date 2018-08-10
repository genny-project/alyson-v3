import { Component } from 'react';
import { bool, func, array } from 'prop-types';

class RetryTimer extends Component {
  static defaultProps = {
    intervals: [500, 1000, 3000],
  }

  static propTypes = {
    manualStart: bool,
    manualIncrement: bool,
    children: func,
    onAttemptRetry: func,
    intervals: array,
  }

  /* eslint-disable react/sort-comp */

  startTimer = () => {
    this.setState({
      secondsElapsed: 0,
      intervalIndex: 0,
      isActive: true,
    }, () => {
      this.setIncrementTimer();

      this.secondsTimer = setInterval( this.incrementSecondsTimer, 1000 );
    });
  }

  endTimer = () => {
    this.setState({ isActive: false });

    this.clearTimer();
  }

  clearTimer = () => {
    if ( this.secondsTimer != null )
      clearInterval( this.secondsTimer );

    if ( this.intervalTimer != null )
      clearTimeout( this.intervalTimer );
  }

  incrementSecondsTimer = () => {
    const { isActive } = this.state;

    if ( !isActive ) {
      this.clearTimer();
    }
    else {
      this.setState( state => ({
        secondsElapsed: state.secondsElapsed + 1,
      }));
    }
  }

  incrementIntervalTimer = () => {
    const { intervals, manualIncrement } = this.props;
    const { isActive, intervalIndex } = this.state;

    if ( !isActive ) {
      clearTimeout( this.secondsTimer );
    }
    else if ( !intervals[intervalIndex] ) {
      this.attemptRetry();
      this.endTimer();
    }
    else {
      this.setState( state => ({
        intervalIndex: state.intervalIndex + 1,
      }), () => {
        this.attemptRetry();

        if ( !manualIncrement ) {
          this.setIncrementTimer();
        }
      });
    }
  }

  setIncrementTimer = () => {
    const { intervals } = this.props;
    const { intervalIndex } = this.state;

    this.intervalTimer = setTimeout( this.incrementIntervalTimer, intervals[intervalIndex] );
  }

  /* eslint-enable react/sort-comp */

  state = {
    isActive: false,
    startTimer: this.startTimer,
    endTimer: this.endTimer,
    clearTimer: this.clearTimer,
    incrementIntervalTimer: this.incrementIntervalTimer,
    secondsElapsed: 0,
    intervalIndex: 0,
    retries: 0,
  }

  componentDidMount() {
    const { manualStart } = this.props;

    if ( !manualStart )
      this.startTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  attemptRetry = () => {
    if ( this.props.onAttemptRetry ) {
      this.setState( state => ({ retries: state.retries + 1 }));

      this.props.onAttemptRetry();
    }
  }

  render() {
    return this.props.children({
      isActive: this.state.isActive,
      startTimer: this.state.startTimer,
      endTimer: this.state.endTimer,
      clearTimer: this.state.clearTimer,
      incrementIntervalTimer: this.state.incrementIntervalTimer,
      secondsElapsed: this.state.secondsElapsed,
      currentInterval: this.props.intervals[this.state.intervalIndex],
      retries: this.state.retries,
    });
  }
}

export default RetryTimer;
