import React, { Component } from 'react';
import { ScrollView, View, SafeAreaView } from 'react-native';
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
      <SafeAreaView style={styles.outer}>
        <View style={styles.inner}>
          <ScrollView>
            <SidebarMenu items={items} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Sidebar;
