import React, { Component } from 'react';
import { any } from 'prop-types';
import { Tabs } from '../../components';

class BucketView extends Component {
  static propTypes = {
    children: any,
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <Tabs
        tabs={[
          { key: 0, title: 'Bucket 1', icon: 'email' },
          { key: 1, title: 'Bucket 2', icon: 'email' },
          { key: 2, title: 'Bucket 3', icon: 'email' },
          { key: 3, title: 'Bucket 4', icon: 'email' },
          { key: 4, title: 'Bucket 5', icon: 'email' },
        ]}
        bottomTabs
      >
        {children}
      </Tabs>
    );
  }
}

export default BucketView;
