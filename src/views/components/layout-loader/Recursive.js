import React, { createElement, PureComponent } from 'react';
import { Text } from 'react-native';
import dlv from 'dlv';
import copy from 'fast-copy';
import { object, any, string } from 'prop-types';
import * as Components from '../index';

class Recursive extends PureComponent {
  static propTypes = {
    component: string,
    props: object,
    children: any,
    context: any,
    repeat: any,
  }

  handleMapCurlyTemplate = template => {
    if (
      !template ||
      !template.includes( '}}' )
    ) {
      return template;
    }

    const { context } = this.props;    

    const splitTemplate = template.split( '}}' );
    const path = splitTemplate[0];

    const textAfterTemplate = splitTemplate.slice( 1 );
    const resolved = dlv( context, path );

    return `${resolved}${textAfterTemplate}`;
  }

  curlyBracketParse = string => {
    return (
      String( string )
        .split( '{{' )
        .map( this.handleMapCurlyTemplate )
        .join( '' )
    );
  }

  handleReducePropInjection = ( result, current ) => {
    const { context } = this.props;

    if ( result[current] == null )
      return result;

    if ( typeof result[current] === 'string' ) {
      if ( result[current].startsWith( '_' )) {
        result[current] = dlv( context, result[current].substring( 1 ));

        return result;
      }
      
      if ( result[current].includes( '{{' )) {
        result[current] = this.curlyBracketParse( result[current] );

        return result;
      }

      return result;
    }

    /* TODO: Make this call the current function recursively.
     * Issue is that `context` suddenly becomes undefined. Look into. */
    if ( result[current] instanceof Array ) {
      for ( let i = 0; i < result[current].length; i++ ) {
        const element = result[current][i];

        if ( typeof element === 'string' ) {
          if ( element.startsWith( '_' )) {
            result[current][i] = dlv( context, element.substring( 1 ));
          }
          
          if ( element.includes( '{{' )) {
            result[current][i] = this.curlyBracketParse( element );
          }
        }
      }

      result[current] = result[current].reduce(
        this.handleReducePropInjection, result[current]
      );

      return result;
    }

    if ( typeof result[current] === 'object' ) {
      const keys = Object.keys( result[current] );
      
      result[current] = keys.reduce( this.handleReducePropInjection, result[current] );

      return result;
    }

    return result;
  }

  injectContextIntoChildren( context, children ) {
    return (
      typeof children === 'string' &&
      children.indexOf( '{{' ) >= 0
    )
      ? this.curlyBracketParse( children )
      : children;
  }

  /**
   * Loops through all of the props for this element and inject the context if required.
   * Additionally parse a handlebars style string and inject variables from the context if needed.
   * If the prop is not a string, simply return its current value so that functions work
   * correctly.
   */
  injectContextIntoProps() {
    const { props } = this.props;

    if ( !props )
      return {};

    const propsCopy = copy( props );
    
    const afterProps =
      Object
        .keys( props )
        .reduce( this.handleReducePropInjection, propsCopy );

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
