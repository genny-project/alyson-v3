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

const wrapper = {
       color:'white',
       margin:'0 auto',
       display: 'flex',
       flexFlow: 'row nowrap',
       justifyContent: 'space-around',
       alignItems: 'center',
};

const iconCustom = {
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      border:'1px solid red',
      padding:'0 10px',
      flexShrink: 0,
};

const textWrapperCustom = {
  width: '80%',
};

const textCustom = {
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      padding:'0 10px',
      alignContent: 'center',
      flexGrow: 0,
      textAlign: 'left',
      lineHeight:'1.6em',
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
