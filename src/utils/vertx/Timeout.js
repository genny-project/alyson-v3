import { Component } from 'react';
import { connect } from 'react-redux';
import { number, bool, func } from 'prop-types';

class BaseEntityQuery extends Component {
  static defaultProps = {
    loadingTimerDuration: 1000,
  }

  static propTypes = {
    loadingTimerDuration: number,
    manualStartLoadingTimer: bool,
    children: func,
  }

  state = {
    /**
     * `querying` should be used in the UI as a timeout
     * to show a loading indicator before default data.
     *
     * For example, in the header we want to show the
     * company's name, so we need to query the base entities
     * to obtain that information. We want to show a loading
     * indicator while we don't have the company's name yet,
     * but we don't want to show the loading indicator for too
     * long. If we don't have the data within
     * `loadingTimerDuration`, we should show something other
     * than the loading indicator, such as the word "Genny".
     * This allows us to show a loading indicator while we're
     * hopeful that the query is successful, but show a loading
     * indicator optimistically without flashing the default data
     * and making our UI look buggy.
     */
    querying: false,
  }

  componentDidMount() {
    const { manualStartLoadingTimer } = this.props;

    if ( !manualStartLoadingTimer )
      this.startQueryTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  startQueryTimer = () => {
    const { loadingTimerDuration } = this.props;

    this.timer = setTimeout( this.finishQueryTimer, loadingTimerDuration );
  }

  finishQueryTimer = () => {
    this.setState({ querying: false });

    this.clearTimer();
  }

  clearTimer() {
    if ( this.timer != null )
      clearTimeout( this.timer );
  }

  render() {
    return this.props.children({
      querying: this.state.querying,
      startQueryTimer: this.state.startQueryTimer,
      finishQueryTimer: this.state.finishQueryTimer,
    });
  }
}

export { BaseEntityQuery };

const mapStateToProps = state => ({
  vertx: state.vertx,
});

export default connect( mapStateToProps )( BaseEntityQuery );
