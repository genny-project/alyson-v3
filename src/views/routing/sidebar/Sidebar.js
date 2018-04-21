import React, { Component } from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';
import { array } from 'prop-types';
import SidebarMenu from './menu';
import styles from './Sidebar.style';

class Sidebar extends Component {
  static propTypes = {
    items: array,
  }

  render() {
    const { items } = this.props;

    return (
      <SafeAreaView>
        <View style={styles.wrapper}>
          <ScrollView>
            <SidebarMenu items={items} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Sidebar;
