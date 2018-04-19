import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { object } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

class Header extends Component {
  static propTypes = {
    navigation: object,
  }

  componentDidMount() {
    StatusBar.setBarStyle( 'light-content' );
    StatusBar.setTranslucent( true );
  }

  handleToggleMenu = () => {
    console.log( 'toggle' ); // eslint-disable-line no-console
  }

  render() {
    const { navigation } = this.props; // eslint-disable-line no-unused-vars

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback
            onPress={this.handleToggleMenu}
            style={{
              display: 'flex',
              flex: 1,
            }}
          >
            <MaterialIcons
              name="menu"
              style={{
                fontSize: 32,
                color: '#FFF',
                marginHorizontal: 5,
                marginRight: 10,
              }}
            />
          </TouchableWithoutFeedback>

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: '#FFF',
            }}
          >
            Genny
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback
            onPress={this.handleToggleMenu}
          >
            <MaterialIcons
              name="chat"
              style={{
                fontSize: 24,
                color: '#FFF',
                marginHorizontal: 5,
              }}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={this.handleToggleMenu}
          >
            <MaterialIcons
              name="notifications"
              style={{
                fontSize: 24,
                color: '#FFF',
                marginHorizontal: 5,
              }}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={this.handleToggleMenu}
          >
            <MaterialIcons
              name="person"
              style={{
                fontSize: 24,
                color: '#FFF',
                marginHorizontal: 5,
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default Header;
