import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { array } from 'prop-types';
import SidebarMenu from './menu';
import styles from './Sidebar.native.style';

class Sidebar extends Component {
  static propTypes = {
    items: array,
  }

  render() {
    const { items } = this.props;

    return (
      <View style={styles.wrapper}>
        <ScrollView>
          <SidebarMenu items={items} />
        </ScrollView>
      </View>
    );
  }
}

export default Sidebar;
