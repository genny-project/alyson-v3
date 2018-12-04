import React, { Component, isValidElement } from 'react';
import { object, array, string } from 'prop-types';
import { FlatList as RNFlatList } from 'react-native';
import Recursive from '../layout-loader/Recursive';

class FlatList extends Component {
  static defaultProps = {
    data: [],
    testID: 'flat-list',
  }

  static propTypes = {
    context: object,
    renderItem: object,
    data: array,
    baseEntities: object,
    testID: string,
  }

  renderItem = ({ item }) => {
    const { renderItem, context } = this.props;

    if ( isValidElement( renderItem ))
      return renderItem;

    return (
      <Recursive
        {...renderItem}
        context={{
          ...context,
          item,
        }}
      />
    );
  }

  render() {
    const { data, testID, ...restProps } = this.props;

    return (
      <RNFlatList
        {...restProps}
        data={data}
        renderItem={this.renderItem}
        testID={testID}
      />
    );
  }
}

export default FlatList;
