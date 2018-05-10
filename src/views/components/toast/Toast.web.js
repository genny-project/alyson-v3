import React from 'react';
import { View, Text } from 'react-native';
import { oneOf, string } from 'prop-types';
import styles from './Toast.type';

const Toast = ({
    text,
    toastType,
}) => {
    return (

      <View
        style={toastType === 'primary' ? styles.primary 
        : toastType === 'error' ? styles.error 
        :  toastType === 'warning' ? styles.warning 
        : toastType === 'success' ? styles.success : styles.primary}
      >
        <Text>
          {text}
        </Text>
      </View>
    );
};

Toast.propTypes = {
    toastType: oneOf(
        ['primary', 'success', 'warning', 'error', 'info']   
    ),
    text: string,
};

export default Toast;
