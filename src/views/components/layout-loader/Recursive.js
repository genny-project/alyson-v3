import React, { createElement, PureComponent } from 'react';
import * as Components from '../index';
import { Text } from 'react-native';
import dlv from 'dlv';
import { object, any, string } from 'prop-types';

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

  injectContextIntoProps( context, props ) {
    if ( !props ) {
      return {};
    }

    return Object.keys( props ).reduce(( result, current ) => ({
      ...result,
      [current]: typeof( props[current] ) === 'string' && props[current].startsWith( '_' ) ? dlv( context, props[current].substring( 1 )) : curlyBracketParse( props[current], path => dlv( context, path )),
    }), {});
  }

  render() {
    const { component, props, children, context, repeat } = this.props;

    const injectedRepeat = repeat ? dlv( context, repeat.substring( 1 )) : null;
    const repeatedChildren = !injectedRepeat ? null : Array.isArray( injectedRepeat )
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

    // console.log({ component, props, children, context }); // eslint-disable-line no-console

    if ( component ) {
      if ( Components[component] ) {
        return createElement(
          Components[component],
          this.injectContextIntoProps( context, props ),
          repeatedChildren ? (
            repeatedChildren instanceof Array
              ? repeatedChildren.map(( child, index ) => (
                <Recursive
                  {...child}
                  context={context}
                  key={`${child.component}_${index}`} // eslint-disable-line react/no-array-index-key
                />
              ))
              : typeof repeatedChildren === 'object'
                ? <Recursive context={context} {...repeatedChildren}  />
                : repeatedChildren
          ) : null,
        );
      }

      return <Text>Component '{component}' does not exist</Text>;
    }

    return children;
  }
}

export default Recursive;
