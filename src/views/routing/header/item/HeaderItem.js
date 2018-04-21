import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './HeaderItem.style';

class HeaderItem extends Component {
  static propTypes = {
    onPress: func,
    icon: string,
  }

  render() {
    const { onPress, icon } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.wrapper}
      >
        <MaterialIcons
          name={icon}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }
}

export default HeaderItem;
