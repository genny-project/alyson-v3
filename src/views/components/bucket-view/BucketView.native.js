import React, { Component } from 'react';
import { any, array, string } from 'prop-types';
import { Tabs } from '../../components';

class BucketView extends Component {
  static defaultProps = {
    tabs: [],
    testID: 'bucket-view',
  }

  static propTypes = {
    children: any,
    tabs: array,
    testID: string,
  }

  render() {
    const {
      children,
      tabs,
      testID,
      ...restProps
    } = this.props;

    const tabData = (
      tabs != null &&
      tabs instanceof Array &&
      tabs.length > 0
    )
      ? tabs
      : (
        children != null &&
        children instanceof Array &&
        children.length > 0
      )
        ? children.map(( child, index ) => {
          const { name } = child.props.props; // TODO: improve method of naming tabs

          return {
            key: index,
            title: name,
          };
        })
        : [{ key: 0, title: 'Loading...' }];

    return (
      <Tabs
        scrollEnabled
        bottomTabs
        {...restProps}
        tabs={tabData}
        testID={testID}
      >
        {children}
      </Tabs>
    );
  }
}

export default BucketView;
