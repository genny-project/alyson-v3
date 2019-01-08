import React from 'react';
import { string, number, shape } from 'prop-types';

import './Timeline.css';

const  Timeline = ({ data,highlightColor = 'teal' , currentIndex = 1 }) => {
  return (
    <div className="timeline">
      <div className="timeline-body"> 
        {
            data && data.length > 0 && data != null  && data !== undefined  ? 
              data && data.map(( dd, i ) => (
                <div
                  className="timeline-body-single-item"
                  key={dd.id}
                >
                  <h3
                    style={{ color: `${i === currentIndex ? highlightColor : 'black'}` }}
                  > 
                    {dd.heading} 
                    <div
                      className="icon"
                      style={{ backgroundColor: `${i === this.props.currentIndex ? highlightColor : 'black'}` }}
                    />
                  </h3>
                  <p
                    className="timeline-date"
                    style={{ color: `${i === currentIndex ? highlightColor : 'black'}` }}
                  > 
                    {dd.date}
                  </p>
                  <p
                    className="timeline-description"
                    style={{ color: `${i === currentIndex ? highlightColor : 'black'}` }}
                  >  
                    {dd.description}
                  </p>
                </div>
              )) : 'No Data found'
      }    
      </div>
    </div>
  );
};

Timeline.propTypes = {
  data: shape( [{ heading: string, date: string, description: string, id: number }] ), 
  currentIndex: number,
  highlightColor: string,
};

export default Timeline;
