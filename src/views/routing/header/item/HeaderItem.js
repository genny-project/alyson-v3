import React, { Component } from 'react';
import { string } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from '../../../components';
import styles from './HeaderItem.style';

class HeaderItem extends Component {
  static propTypes = {
    icon: string,
    href: string,
  }

  render() {
    const { icon, href } = this.props;

    return (
      <Link
        to={href}
      >
        <TouchableOpacity
          style={styles.wrapper}
        >
          <MaterialIcons
            name={icon}
            style={styles.icon}
          />
        </TouchableOpacity>
      </Link>
    );
  }
}

export default HeaderItem;
