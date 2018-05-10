import React from 'react';
import { View, Text } from 'react-native';
import { oneOf, string } from 'prop-types';
import {Icon} from '../../components';
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
      <View style={
          {
              color:'white',
              margin:'0 auto',
              display: 'flex',
              flexFlow: 'row nowrap',
              justifyContent: 'space-around',
              alignItems: 'center'
            }
        }> 

      <Icon name={toastType === 'primary' ? 'done'
      : toastType === 'success' ? 'check_circle_outline'
      : toastType === 'warning' ? 'warning'
      : toastType === 'error' ? 'error'
      : 'done'}
      style={
          {
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            border:'1px solid red',
            padding:'0 10px',
            flexShrink: 0
          }
        }
      />
        <View style={{
            flexBasis : 100,
            width:'80%'
        }}>
        <Text style={
            {
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                padding:'0 10px',
                alignContent: 'center',
                flexGrow: 0,
                textAlign: 'left',
                lineHeight:'1.6em'
            }
        }>
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
