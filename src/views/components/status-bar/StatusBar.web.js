import { any } from 'prop-types';

/* Mock the component. */
const StatusBar = ({ children }) => children;

StatusBar.propTypes = {
  children: any,
};

export default StatusBar;
