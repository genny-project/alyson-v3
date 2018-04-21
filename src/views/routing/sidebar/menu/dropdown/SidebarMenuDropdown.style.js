import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  nested: {
    paddingLeft: 15,
  },
});

export default styles;
