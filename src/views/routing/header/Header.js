import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { object } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar, Link } from '../../components';
import styles from './Header.style';
import HeaderItem from './item';

class Header extends Component {
  static propTypes = {
    navigation: object,
  }

  handleToggleMenu = () => {
    const { navigation } = this.props;

    navigation.navigate( 'DrawerToggle' );
  }

  render() {
    const { navigation } = this.props; // eslint-disable-line no-unused-vars

    return (
      <StatusBar
        barStyle="light-content"
        translucent
      >
        <View style={styles.wrapper}>
          <View style={styles.left}>
            <TouchableWithoutFeedback
              onPress={this.handleToggleMenu}
              style={styles.menuWrapper}
            >
              <MaterialIcons
                name="menu"
                style={styles.menuIcon}
              />
            </TouchableWithoutFeedback>

            <Link to="home">
              <Text style={styles.title}>Genny</Text>
            </Link>
          </View>

          <View style={styles.right}>
            <HeaderItem
              href="chat"
              icon="chat"
            />

            <HeaderItem
              href="alerts"
              icon="notifications"
            />

            <HeaderItem
              href="profile"
              icon="person"
            />
          </View>
        </View>
      </StatusBar>
    );
  }
}

export default Header;
