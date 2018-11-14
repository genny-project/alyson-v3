import React, { Fragment } from 'react';
import { shape, string, number } from 'prop-types';
import * as ReactTimeline from 'react-timeline-scribble';

const   Timeline  = ( props ) => {
  const renderEvents = () => {
    const { data } = props;

    return data.map( dd => (
      <ReactTimeline.Event
        interval={dd.date}
        title={dd.title}
        key={dd.key}
      />
    ));
  };

  return (
    <Fragment>
      <ReactTimeline.Timeline>
        {renderEvents()}
      </ReactTimeline.Timeline>
    </Fragment>
  );
};

Timeline.propTypes = { 
  data: shape({
    date: string, 
    title: string,
    key: number,
  }),
};

export default Timeline;
