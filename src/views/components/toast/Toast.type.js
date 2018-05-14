import { StyleSheet, Platform } from 'react-native';

const base = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 15,
  paddingBottom: 15,
  textAlign: 'center',
  width: 300,
  height: 'auto',
  color: '#f9f3f3',
};

const wrapper = {
  color: 'white',
  ...Platform.select({
    native: {
      height: 120,
    },
  }),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
};

const iconCustom = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '0 10px',
  flexShrink: 0,
};

const textWrapperCustom = {
  width: '80%',
};

const textCustom = {
  color: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  ...Platform.select({
    web: {
      padding: '0 10px',
    },
    native: {
      fontWeight: 100,
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 1,
      paddingLeft: 1,
    },
  }),
  alignContent: 'center',
  flexGrow: 0,
  textAlign: 'left',
  lineHeight: Platform.OS === 'web' ? '1.6em' : 20,
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
  wrapper: {
    ...wrapper,
  },
  iconCustom: {
    ...iconCustom,
  },
  textWrapperCustom: {
    ...textWrapperCustom,
  },
  textCustom: {
    ...textCustom,
  },
});

export default toastTypes;