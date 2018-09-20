import React, { Component } from 'react';
import { node, object } from 'prop-types';

class Toolbar extends Component  {
  static propTypes = {
    children: node,
    ToolBarStyle: object,
  }

  render() {
    const { ToolBarStyle  }  =  this.props;

    return (
      <div style={{ ... ToolBarDefaultStyle, ... ToolBarStyle }}> 
        {this.props.children}
      </div>
    );
  }
}

export default Toolbar;

const ToolBarDefaultStyle = {
  position: 'relative',
  padding: '15px 5px 5px',
  margin: '0px 0px 20px',
  borderBottom: '2px solid #eee',
  marginBottom: '20px',
  backgroundColor: 'white',
  width: '100%',
};
