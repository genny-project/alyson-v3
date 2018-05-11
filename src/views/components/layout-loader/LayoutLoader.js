import React, { createElement, PureComponent } from 'react';
import { Text } from 'react-native';
import { shape, object, any, string } from 'prop-types';
import * as Components from '../index';
import Layout from '../../layout';
import DataQuery from '../../../utils/data-query';
import dlv from 'dlv';

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

    console.log( props );

    return Object.keys( props ).reduce(( result, current ) => ({
      ...result,
      [current]: curlyBracketParse( props[current], path => dlv( context, path )),
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
                ? <Recursive {...children} />
                : children
          ),
        );
      }

      return <Text>Component '{component}' does not exist</Text>;
    }

    return children;
  }
}

class LayoutLoader extends PureComponent {
  static propTypes = {
    layout: shape({
      layout: object,
      children: any,
      context: any,
    }),
    data: object,
  }

  render() {
    const { layout, data } = this.props;

    console.log({ layout }); // eslint-disable-line no-console

    if ( !layout )
      return <Text>No layout specified</Text>;

    /* Calculate the data for the layout */
    const context = { query: new DataQuery( data ).query( layout.query || [] ) };

    return (
      <Layout {...layout.layout} context={context}>
        {layout.children && (
          layout.children instanceof Array
          ? layout.children.map( child => <Recursive {...child} context={context} /> ) // eslint-disable-line react/jsx-key
          : layout.children
        )}
      </Layout>
    );
  }
}

export default LayoutLoader;
