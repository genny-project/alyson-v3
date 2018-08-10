import { Component } from 'react';
import copy from 'fast-copy';
import dlv from 'dlv';
import { func } from 'prop-types';
import { store } from '../../../redux';

const handleMapCurlyTemplate = data => ( template ) => {
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

const curlyBracketParse = ( string, data ) => {
  return (
    String( string )
      .split( '{{' )
      .map( handleMapCurlyTemplate( data ))
      .join( '' )
  );
};

const handleReducePropInjection = data => ( result, current ) => {
  if ( result[current] == null )
    return result;

  if ( typeof result[current] === 'string' ) {
    if ( result[current].startsWith( '_' )) {
      result[current] = dlv( data, result[current].substring( 1 ));

      return result;
    }

    if ( result[current].includes( '{{' )) {
      result[current] = curlyBracketParse( result[current], data );

      return result;
    }

    return result;
  }

  if ( result[current] instanceof Array ) {
    result[current] = result[current].map(
      item => {
        if ( typeof item === 'object' ) {
          const keys = Object.keys( item );

          return keys.reduce( handleReducePropInjection( data ), item );
        }

        return item;
      }
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

  return injectedProps;
};

class PropInjection extends Component {
  static propTypes = {
    children: func,
  }

  static getDerivedStateFromProps( props ) {
    return injectProps( props );
  }

  state = {}

  render() {
    return this.props.children( this.state );
  }
}

export default PropInjection;
