import React, { PureComponent } from 'react';
import PDF from 'react-pdf-js';
import { string, object } from 'prop-types';

class  PdfViewer extends PureComponent  {
  static propTypes = { 
    file: string,
    style: object,
  };

  state = {
    page: 1,
  };

  // On document complete
  onDocumentComplete = () => {
    this.setState({ page: 1 });
  }

  handlePrev = () => {
    const { page } = this.state;

    // dont decrease page size if the page number is 1 
    if ( !( page < 1 )) {
      this.setState( prevState => ({ page: prevState.page - 1 }));
    }
  }

  handleNext = () => {
    this.setState( prevState => ({ page: prevState.page + 1 }));
  }

  renderPagination = () => {
    return (
      <div style={{
        width: '50%',
        backgroundColor: 'whitesmoke',
        height: '60px',
        border: '1px solid #bdbdbd;',
        position: 'absolute',
        bottom: '10px',
      }}
      >
        <ul style={ulStyle}>
          <li
            onClick={this.handlePrev}
            style={liStyle}
          >
        Previous page
          </li>
          <li>
          Current Page: 
            {' '}
            {this.state.page}
          </li>
          <li
            onClick={this.handleNext}
            style={liStyle}
          >
        Next page
          </li>
        </ul>
      </div>
    );
  }

  render() {
    const { file, style } = this.props;
    const componentStyle = style;

    return (
      <div
        style={{
          background: 'whitesmoke',
          height: '100%',
          width: '100%',
          overflow: 'scroll',
          border: '6px solid #e4e4e4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          ...componentStyle,
        }}
      >
        {file !== 'undefined' && file != null ? (
          <PDF
            style={{ width: '700px' }}
            onDocumentComplete={this.handleDocumentComplete}
            file={file}
            page={this.state.page}
          />
        ) : 'File Loading'}

        {file !== 'undefined' && file != null ? this.renderPagination() : null}
       
      </div>
    );
  }
}

export default PdfViewer;

const ulStyle = {
  listStyleType: 'none',
  display: 'flex',
  padding: '5px',
  justifyContent: 'space-around',
};

const liStyle = { 
  cursor: 'pointer',
  borderBottom: '2px solid #444',
  paddingBottom: '2px',
};
