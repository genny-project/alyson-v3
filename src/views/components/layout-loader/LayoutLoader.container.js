import { connect } from 'react-redux';
import LayoutLoader from './LayoutLoader';

const mapStateToProps = state => ({
  data: state.vertx,
});

export default connect( mapStateToProps, null )( LayoutLoader );
