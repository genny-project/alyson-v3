import { Alert } from 'react-native';

const alert = ({ title, message, buttons, options, type }) => {
  Alert.alert(
    title,
    message,
    buttons,
    options,
    type
  );
};

export default alert;
