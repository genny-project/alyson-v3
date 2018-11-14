import React, { Component , Fragment } from 'react';
import { Timeline, Event } from 'react-timeline-scribble';
import { array } from 'prop-types';

class  EventTimeline  extends Component {
  static propTypes = { 
    data: array,
  }

  renderEvents = () => { 
    const { data } = this.props;

    return data.map( dd => (
      <Event
        interval={dd.date}
        title={dd.title}
        key={dd.key}
      />
    ));
  }

  render() {
    return (
      <Fragment>
        <Timeline>
          {this.renderEvents()}
        </Timeline>
      </Fragment>
    );
  }
}

export default EventTimeline;
