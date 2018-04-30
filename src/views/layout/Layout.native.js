import React, { Component, Fragment } from 'react';
import { oneOf, node, object } from 'prop-types';
import { LayoutConsumer } from '../layout';

class Layout extends Component {
  static defaultProps = {
    appColor: 'dark',
    backgroundColor: 'dark',
  }

  static propTypes = {
    children: node,
    appColor: oneOf(
      ['light', 'dark']
    ),
    backgroundColor: oneOf(
      ['white', 'grey']
    ),
    layout: object,
  }

  componentDidMount() {
    const { backgroundColor, appColor, layout } = this.props;

    if ( layout.backgroundColor !== backgroundColor )
      layout.setBackgroundColor( backgroundColor );

    if ( layout.appColor !== appColor )
      layout.setAppColor( appColor );
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }
}

export default props => (
  <LayoutConsumer>
    {layout => (
      <Layout {...props} layout={layout} />
    )}
  </LayoutConsumer>
);
