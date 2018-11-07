import React from 'react';
import { func, object, node } from 'prop-types';

const IconWrapper = ( props ) => {
  const componentStyle = { ...props.style };

  return (
    <span
      style={{ ...IconWrapperStyle, ...componentStyle }}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}  /* controls the action of action buttons */
      
    >
      {props.children}
    </span>
  );
};

IconWrapper.propTypes = {
  onClick: func, 
  onMouseDown: func,
  style: object,
  children: node,
};

const IconWrapperStyle = { 
  cursor: 'pointer',
  color: ` ${props =>
    props.reversed
      ? props.active ? 'white' : '#aaa'
      : props.active ? 'black' : '#ccc'}
`,
};

export default IconWrapper;
