import React, { Component } from 'react';
import { any, array, string } from 'prop-types';
import { Tabs } from '../../components';

class BucketView extends Component {
  static defaultProps = {
    tabs: [],
  }

  static propTypes = {
    children: any,
    tabs: array,
    tabBarSize: string,
    tabBarBackground: string,
    activeTabBackground: string,
    iconColor: string,
    textColor: string,
  }

  render() {
    const {
      children,
      tabs,
      tabBarSize,
      tabBarBackground,
      activeTabBackground,
      iconColor,
      textColor,
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
        tabs={tabData}
        tabBarSize={tabBarSize}
        tabBarBackground={tabBarBackground}
        activeTabBackground={activeTabBackground}
        iconColor={iconColor}
        textColor={textColor}
      >
        {children}
      </Tabs>
    );
  }
}

export default BucketView;
