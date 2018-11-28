import React, { Component } from 'react';
import PDF from 'react-pdf-js';
import { string, object } from 'prop-types';

class PdfViewer extends Component {
  static propTypes = {
    file: string,
    style: object,
  };

  state = {
    page: 1,
    pages: null,
  }

  onDocumentComplete = pages => {
    this.setState(
      {
        page: 1,
        pages,
      }
    );
  };

  handlePrevious = () => {
    this.setState( preVstate => ({ page: preVstate.page - 1 }));
  }

  handleNext = () => {
    this.setState( preVstate => ({ page: preVstate.page + 1 }));
  };

  renderPagination = ( page, pages ) => {
    let previousButton = (
      <li
        className="previous"
        onClick={this.handlePrevious}
      >
        <a href="#">
          <i className="fa fa-arrow-left" />
          {' '}
Previous
        </a>
      </li>
    );

    if ( page === 1 ) {
      previousButton = (
        <li className="previous disabled">
          <a href="#">
            <i className="fa fa-arrow-left" />
            {' '}
Previous
          </a>
        </li>
      );
    }
    let nextButton = (
      <li
        className="next"
        onClick={this.handleNext}
      >
        <a href="#">
          Next 
          {' '}
          <i className="fa fa-arrow-right" />
        </a>
      </li>
    );

    if ( page === pages ) {
      nextButton = (
        <li className="next disabled">
          <a href="#">
            Next 
            {' '}
            <i className="fa fa-arrow-right" />
          </a>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
    );
  };

  render() {
    const { file, style } = this.props;
    let pagination = null;

    if ( this.state.pages ) {
      pagination = this.renderPagination( this.state.page, this.state.pages );
    }

    return (
      <div
        style={{
          background: '#6b6b6b',
          height: 'auto',
          width: '100%',
          overflow: 'scroll',
          padding: '5% 8%',
          marginBottom: '30px',
        }}
      >
        {file !== 'undefined' && file != null ? (
          <div>
            <PDF
              onDocumentComplete={this.handleDocumentComplete}
              page={this.state.page}
              style={{
                ...style,
              }}
              file={file}
            />
            {pagination}
          </div>
        ) : (
          'File Not Found'
        )}
      </div>
    );
  }
}

export default PdfViewer;
