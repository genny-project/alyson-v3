import React, { PureComponent } from 'react';
import { oneOfType, number, string , object }  from 'prop-types';
import Pdf from 'react-pdf-js-infinite';

class  PdfViewer extends PureComponent  {
  static defaultProps = { 
    height: '700px',
  }

  static propTypes = {
    file: string,
    style: object,
    height: oneOfType( [string, number] ),
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

  render() {
    const { file, style , height } = this.props;
    const componentStyle = style;

    return (
      <div
        style={{
          height: height,
          width: '100%',
          overflow: 'scroll',
          ...componentStyle,
        }}
      >
        {file !== 'undefined' && file != null ? (
          <Pdf
            style={{ maxWidth: '700px' }}
            onDocumentComplete={this.handleDocumentComplete}
            file={file}
            page={this.state.page}
          />
        ) : 'File Loading'}

      </div>
    );
  }
}

export default PdfViewer;

