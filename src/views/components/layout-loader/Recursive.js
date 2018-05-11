import React, { createElement, PureComponent } from 'react';
import * as Components from '../index';
import { Text } from 'react-native';
import dlv from 'dlv';
import { object, any, string } from 'prop-types';

const curlyBracketParse = ( input, method ) => {
  return `${input}`.split( '{{' ).map( i => i.includes( '}}' ) ? method( i.split( '}}' )[0] ) : i ).join( '' );
};

class Recursive extends PureComponent {
  static propTypes = {
    component: string,
    props: object,
    children: any,
    context: any,
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
    const { component, props, children, context } = this.props;

    console.log({ component, props, children }); // eslint-disable-line no-console

    if ( component ) {
      if ( Components[component] ) {
        return createElement(
          Components[component],
          this.injectContextIntoProps( context, props ),
          children && (
            children instanceof Array
              ? children.map( child => <Recursive {...child} context={context} /> ) // eslint-disable-line react/jsx-key
              : typeof children === 'object'
                ? <Recursive {...children} context={context} />
                : children
          ),
        );
      }

      return <Text>Component '{component}' does not exist</Text>;
    }

    return children;
  }
}

export default Recursive;
