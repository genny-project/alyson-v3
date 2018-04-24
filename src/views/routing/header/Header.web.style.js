import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#232323',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
    height: 75,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuWrapper: {
    display: 'flex',
    flex: 1,
  },
  menuIcon: {
    fontSize: 32,
    color: '#FFF',
    marginHorizontal: 5,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFF',
  },
});

export default styles;
