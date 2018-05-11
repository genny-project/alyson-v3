import React from 'react';
import { View, Text } from 'react-native';
import { oneOf, string } from 'prop-types';
import { Icon } from '../../components';
import styles from './Toast.type';

const Toast = ({
  text,
  toastType,
}) => {
  return (
          < View style = {
                  toastType === 'primary' ?
                    styles.primary : 
                   toastType === 'error' ?
                     styles.error : 
                    toastType === 'warning' ?
                      styles.warning : 
                     toastType === 'success' ?
                       styles.success : 
                     styles.primary
                } >
          <View style = {styles.wrapper} >
            <Icon name = {
              toastType === 'primary' ?
                'done' : 
                 toastType === 'success' ?
                  'done' : 
                    toastType === 'warning' ?
                      'warning' : 
                      toastType === 'error' ?
                         'error' : 
                        'done'
                  }
              style = {styles.iconCustom}
            />
         <View style={styles.textWrapperCustom} >
            <Text style={styles.textCustom} >
                {text}
            </Text>
          </View>
      </View>
    </View>
  );
};

Toast.propTypes = {
    toastType: oneOf(
        ['primary', 'success', 'warning', 'error']
    ),
    text: string,
};

export default Toast;
