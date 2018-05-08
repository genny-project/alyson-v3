import React, { createElement, PureComponent } from 'react';
import { Text } from 'react-native';
import { shape, object, any, string } from 'prop-types';
import * as Components from '../index';
import Layout from '../../layout';

class Recursive extends PureComponent {
  static propTypes = {
    component: string,
    props: object,
    children: any,
  }

  render() {
    const { component, props, children } = this.props;

    console.log({ component, props, children }); // eslint-disable-line no-console

    if ( component ) {
      if ( Components[component] ) {
        return createElement(
          Components[component],
          props,
          children instanceof Array
            ? children.map( child => <Recursive {...child} /> ) // eslint-disable-line react/jsx-key
            : children
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
    }),
  }

  render() {
    const { layout } = this.props;

    console.log({ layout }); // eslint-disable-line no-console

    if ( !layout )
      return <Text>No layout specified</Text>;

    return (
      <Layout {...layout.layout}>
        {layout.children && (
          layout.children instanceof Array
          ? layout.children.map( child => <Recursive {...child} /> ) // eslint-disable-line react/jsx-key
          : layout.children
        )}
      </Layout>
    );
  }
}

export default LayoutLoader;
