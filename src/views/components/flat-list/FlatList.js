import React, { Component, isValidElement } from 'react';
import { object, array } from 'prop-types';
import { FlatList as RNFlatList } from 'react-native';
import Recursive from '../layout-loader/Recursive';

class FlatList extends Component {
  static defaultProps = {
    data: [],
  }

  static propTypes = {
    context: object,
    renderItem: object,
    data: array,
    baseEntities: object,
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
    const { data, ...restProps } = this.props;

    return (
      <RNFlatList
        {...restProps}
        data={data}
        renderItem={this.renderItem}
        testID="flat-list"
      />
    );
  }
}

export default FlatList;
