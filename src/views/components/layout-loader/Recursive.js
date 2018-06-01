import React, { createElement, PureComponent } from 'react';
import { Text } from 'react-native';
import dlv from 'dlv';
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

  injectContextIntoChildren( context, children ) {
    return typeof children === 'string' ? curlyBracketParse( children, path => dlv( context, path )) : children;
  }

  injectContextIntoProps( context, props ) {
    if ( !props ) {
      return {};
    }

    /**
     * Loops through all of the props for this element and inject the context if required.
     * Additionally parse a handlebars style string and inject variables from the context if needed.
     * If the prop is not a string, simply return its current value so that functions work
     * correctly.
     */
    const afterProps = Object.keys( props ).reduce(( result, current ) => ({
      ...result,
      [current]: typeof( props[current] ) === 'string'
        ? ( props[current].startsWith( '_' )
          ? dlv( context, props[current].substring( 1 ))
          : curlyBracketParse( props[current], path => dlv( context, path )))
        : props[current],
    }), {});

    return afterProps;
  }

  render() {
    const { component, props, children, context, repeat } = this.props;
    const injectedRepeat = repeat ? dlv( context, repeat.substring( 1 )) : null;
    // console.log(repeat, injectedRepeat);
    
    const repeatedChildren = injectedRepeat && Array.isArray( injectedRepeat )
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

    if ( component ) {
      if ( Components[component] ) {
        return createElement(
          Components[component],
          this.injectContextIntoProps( context, props ),
          repeatedChildren && (
            repeatedChildren instanceof Array
              ? repeatedChildren.map(( child, index ) =>
                // eslint-disable-next-line react/no-array-index-key
                <Recursive context={context} key={index} {...child} />
              )
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
