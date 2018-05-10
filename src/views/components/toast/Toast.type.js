import { StyleSheet } from 'react-native';

const base = {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        textAlign : 'center',
        width:300,
        height:'auto',
        color : '#f9f3f3',

};

const toastTypes = StyleSheet.create({
  primary: {
      ...base,
    backgroundColor: '#3498db',
    color: '#fff',
  },
  success: {
      ...base,
    backgroundColor: '#2ecc71',
    
  },
  warning: {
      ...base,
    backgroundColor: '#e67e22',
  },
  error: {
      ...base,
    backgroundColor: '#e74c3c',
    
  },
});

export default toastTypes;
