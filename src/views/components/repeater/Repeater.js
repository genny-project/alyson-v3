import { cloneElement } from 'react';

const Repeater = ({ children, data, context, ...restProps }) => {
  if ( !data ) {
    return null;
  }

  if ( !Array.isArray( data )) {
    return null;
  }

  return data.map( item => {
    return cloneElement( children, { props: { ...restProps, ...item }, context: { ...context, repeater: item } });
  });
};

export default Repeater;
