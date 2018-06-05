import React, { createElement, PureComponent } from 'react';
import { Text } from 'react-native';
import dlv from 'dlv';
import copy from 'fast-copy';
import { object, any, string } from 'prop-types';
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

  handleReducePropInjection = context => ( result, current ) => {
    if ( result[current] == null )
      return result;

    if ( typeof result[current] === 'string' ) {
      if ( result[current].startsWith( '_' )) {
        result[current] = dlv( context, result[current].substring( 1 ));

        return result;
      }
      
      result[current] = curlyBracketParse( result[current], path => dlv( context, path ));

      return result;
    }

    if ( result[current] instanceof Array ) {
      result[current] = result[current].reduce(
        this.handleReducePropInjection( context ), result[current]
      );

      return result;
    }

    if ( typeof result[current] === 'object' ) {
      const keys = Object.keys( result[current] );
      
      result[current] = keys.reduce( this.handleReducePropInjection( context ), result[current] );

      return result;
    }

    return result;
  }

  injectContextIntoChildren( context, children ) {
    return (
      typeof children === 'string' &&
      children.indexOf( '{{' ) >= 0
    )
      ? curlyBracketParse( children, path => dlv( context, path ))
      : children;
  }

  /**
   * Loops through all of the props for this element and inject the context if required.
   * Additionally parse a handlebars style string and inject variables from the context if needed.
   * If the prop is not a string, simply return its current value so that functions work
   * correctly.
   */
  injectContextIntoProps() {
    const { props, context } = this.props;

    if ( !props )
      return {};

    const propsCopy = copy( props );

    /**
     * Loops through all of the props for this element and inject the context if required.
     * Additionally parse a handlebars style string and inject variables from the context if needed.
     * If the prop is not a string, simply return its current value so that functions work
     * correctly.
     */
    const afterProps =
      Object
        .keys( props )
        .reduce( this.handleReducePropInjection( context ), propsCopy );

    return afterProps;
  }

  render() {
    const { component, props, children, context, repeat } = this.props;

    if ( !component )
      return children;

    if ( !Components[component] ) {
      return (
        <Text>
          Component '
          {component}
          ' does not exist
        </Text>
      );
    }

    const injectedRepeat = repeat ? dlv( context, repeat.substring( 1 )) : null;

    const repeatedChildren = (
      injectedRepeat &&
      injectedRepeat instanceof Array
    )
      ? injectedRepeat.map( child => ({
        ...children,
        props: {
          ...children.props, ...child,
        },
        context: {
          ...context,
          repeater: child,
          parentRepeater: context.repeater,
        },
      }))
      : this.injectContextIntoChildren( context, children );

    return createElement(
      Components[component],
      this.injectContextIntoProps( context, props ),
      repeatedChildren instanceof Array
        ? repeatedChildren.map(( child, index ) => (
          // eslint-disable-next-line react/no-array-index-key
          <Recursive context={context} key={index} {...child} />
        ))
        : typeof repeatedChildren === 'object'
          ? <Recursive context={context} {...repeatedChildren}  />
          : repeatedChildren
    );
  }
}

export default Recursive;
