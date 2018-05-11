import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import { shape, object, any } from 'prop-types';
import Layout from '../../layout';
import DataQuery from '../../../utils/data-query';
import Recursive from './Recursive';

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

    if ( !layout )
      return <Text>No layout specified</Text>;

    /* Calculate the data for the layout */
    const context = { query: new DataQuery( data ).query( layout.query || [] ) };

    return (
      <Layout {...layout.layout} context={context}>
        {layout.children ? (
          layout.children instanceof Array
            ? layout.children.map(( child, index ) => (
              <Recursive
                {...child}
                context={context}
                key={`${child.component}_${index}`} // eslint-disable-line react/no-array-index-key
              />
            ))
            : layout.children
        ) : null}
      </Layout>
    );
  }
}

export default LayoutLoader;
