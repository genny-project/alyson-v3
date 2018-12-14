import React, { Component } from 'react';
import { oneOfType, string, number, object } from 'prop-types';

class Pdf extends Component {
  static defaultProps = {
    style: {},
    height: '600px',
    width: '600px',
  };

  static propTypes = {
    width: oneOfType( [number, string] ),
    height: oneOfType( [number, string] ), 
    style: object,
    file: string,
  };

  render() {
    const { width, height, style, file } = this.props;
    const componentStyle = style;

    return (
      <div
        style={
            { height: height, width: width, ...componentStyle  }
          }
      >
        { file !== null && file !== undefined && file !== 'undefined' ? (
          <iframe
            title="pdf-document"
            src={file}
            width="100%"
            height="100%"
          />
        ) : 'Pdf Document Loading Please Wait'
        }
      </div>
    );
  }
}

export default Pdf;

