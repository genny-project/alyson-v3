import React, { Component } from 'react';
import copy from 'fast-copy';
import dlv from 'dlv';
import { string, object, number, oneOfType, shape, arrayOf, bool, oneOf, node } from 'prop-types';
import { store } from '../../../redux';

const handleMapCurlyTemplate = ( template, data ) => {
  if (
    !template ||
    !template.includes( '}}' )
  ) {
    return template;
  }

  const splitTemplate = template.split( '}}' );
  const path = splitTemplate[0];

  const textAfterTemplate = splitTemplate.slice( 1 );
  const resolved = dlv( data, path );

  return `${resolved}${textAfterTemplate}`;
};

const curlyBracketParse = string => {
  return (
    String( string )
      .split( '{{' )
      .map( handleMapCurlyTemplate )
      .join( '' )
  );
};

const handleReducePropInjection = data => ( result, current ) => {
  if ( result[current] == null )
    return result;

  if ( typeof result[current] === 'string' ) {
    // console.warn( result[current] );
    if ( result[current].startsWith( '_' )) {
      result[current] = dlv( data, result[current].substring( 1 ));

      return result;
    }

    if ( result[current].includes( '{{' )) {
      console.warn( '###########################' );
      console.warn( result[current] );
      result[current] = curlyBracketParse( result[current] );
      console.warn( result[current] );

      return result;
    }

    return result;
  }

  if ( result[current] instanceof Array ) {
    result[current] = result[current].reduce(
      handleReducePropInjection( data ), result[current]
    );

    return result;
  }

  if ( typeof result[current] === 'object' ) {
    const keys = Object.keys( result[current] );

    result[current] = keys.reduce( handleReducePropInjection( data ), result[current] );

    return result;
  }

  return result;
};

const injectProps = props => {
  const { user } = store.getState().vertx;

  const data = { user };

  const injectedProps =
    Object.keys( props ).reduce( handleReducePropInjection( data ),  copy( props ));

  console.warn( injectedProps );

  return injectedProps;
};

class PropInjection extends Component {
  static defaultProps = {
  }

  static propTypes = {
    children: node,
  }

  static getDerivedStateFromProps( props ) {
    return injectProps( props );
  }

  render() {
    console.warn({ props: this.props, state: this.state });

    return ( this.props.children(
      this.state
    ));
  }
}

export default PropInjection;
