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

  getTabs = ( children ) => {
    return [children.map(( child, index ) => {
      return { 
        key: index,
        title: `Tab ${index + 1}`,
      };
    })];
  }

  render() {
    const {
      children,
      tabs,
    } = this.props;

    const tabData = tabs ? tabs : this.getTabs( children );
    
    // console.log(tabData);

    return (
      <Tabs
        tabs={tabData}
      >
        {children}
      </Tabs>
    );
  }
}

export default BucketView;
