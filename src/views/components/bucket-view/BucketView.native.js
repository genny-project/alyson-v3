import React, { Component } from 'react';
import { any, array } from 'prop-types';
import { Tabs } from '../../components';

class BucketView extends Component {
  static defaultProps = {
    tabs: [],
  }

  static propTypes = {
    children: any,
    tabs: array,
  }

  render() {
    const {
      children,
      tabs,
    } = this.props;

    const tabData = (
      tabs instanceof Array &&
      tabs.length > 0 
    ) ? 
      tabs : 
      children.map(( child, index ) => {
        return { 
          key: index,
          title: `Tab ${index + 1}`,
        };
      });
    
    return (
      <Tabs
        bottomTabs
        tabs={tabData}
      >
        {children}
      </Tabs>
    );
  }
}

export default BucketView;
