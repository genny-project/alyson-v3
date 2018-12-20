import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';

import './Timeline.css';

class Timeline extends Component {
  static defaultProps = {
    currentIndex: 1,
    highlightColor: 'teal',
  }

  static propTypes = {
    data: shape( [{ heading: string, date: string, description: string, id: number }] ), 
    currentIndex: number,
    highlightColor: string,
  }

  render() { 
    const { data,highlightColor , currentIndex } = this.props;

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
  }
}

export default Timeline;
