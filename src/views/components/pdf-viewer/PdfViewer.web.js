import React, { Component } from 'react';
import { oneOfType, string, number, object } from 'prop-types';

class Pdf extends Component {
  static defaultProps = {
    width: '600px',
    height: '600px',
    style: {},
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
            { height: height, width: width, margin: '0 auto', ...componentStyle }
          }
      >
        { file ? (
          <iframe
            title="pdf-document"
            src={file}
            width="100%"
            height="100%"
          />
        ) : null 
        }
      </div>
    );
  }
}

export default Pdf;

