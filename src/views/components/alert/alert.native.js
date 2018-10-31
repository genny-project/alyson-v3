import { Alert } from 'react-native';

const alert = ({ title, message, buttons, options }) => {
  Alert.alert(
    title,
    message,
    buttons,
    options
  );
};

export default alert;
