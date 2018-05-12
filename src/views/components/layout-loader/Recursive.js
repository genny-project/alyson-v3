import React, { createElement, PureComponent } from 'react';
import { Text } from 'react-native';
import { object, any, string } from 'prop-types';
import dlv from 'dlv';
import * as Components from '../index';

const curlyBracketParse = ( input, method ) => {
  return `${input}`.split( '{{' ).map( i => i.includes( '}}' ) ? `${method( i.split( '}}' )[0] )}${i.split( '}}' ).slice( 1 )}` : i ).join( '' );
};

class Recursive extends PureComponent {
  static propTypes = {
    component: string,
    props: object,
    children: any,
    context: any,
    repeat: any,
  }

  handleReduce = ( result, current ) => {
    const { props, context } = this.props;

    const value = typeof props[current] === 'string'
      ? (
        props[current].startsWith( '_' )
          ? dlv( context, props[current].substring( 1 ))
          : curlyBracketParse( props[current], path => dlv( context, path ))
      )
      : props[current];

    return {
      ...result,
      [current]: value,
    };
  }

  injectContextIntoProps( context, props ) {
    if ( !props )
      return {};

    return Object.keys( props ).reduce( this.handleReduce, {});
  }

  render() {
    const { component, props, children, context, repeat } = this.props;

    const injectedRepeat = repeat ? dlv( context, repeat.substring( 1 )) : null;
    const repeatedChildren = injectedRepeat && Array.isArray( injectedRepeat )
      ? injectedRepeat.map( child => ({
        ...children,
        props: {
          ...children.props, ...child,
        },
        context: {
          ...context,
          repeater: child,
        },
      }))
      : children;

    if ( component ) {
      if ( Components[component] ) {
        return createElement(
          Components[component],
          this.injectContextIntoProps( context, props ),
          repeatedChildren && (
            repeatedChildren instanceof Array
              // eslint-disable-next-line react/jsx-key
              ? repeatedChildren.map( child => <Recursive context={context} {...child} /> )
              : typeof repeatedChildren === 'object'
                ? <Recursive context={context} {...repeatedChildren}  />
                : repeatedChildren
          ),
        );
      }

      return (
        <Text>
          Component '
          {component}
          ' does not exist
        </Text>
      );
    }

    return children;
  }
}

export default Recursive;
