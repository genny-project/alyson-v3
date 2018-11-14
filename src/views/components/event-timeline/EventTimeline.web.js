import React, { Fragment } from 'react';
import { Timeline, Event } from 'react-timeline-scribble';
import { array } from 'prop-types';

const   EventTimeline  = ( props ) => {
  const renderEvents = () => {
    const { data } = props;

    return data.map( dd => (
      <Event
        interval={dd.date}
        title={dd.title}
        key={dd.key}
      />
    ));
  };

  return (
    <Fragment>
      <Timeline>
        {renderEvents()}
      </Timeline>
    </Fragment>
  );
};

EventTimeline.propTypes = { 
  data: array,
};

export default EventTimeline;
