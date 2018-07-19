import { connect } from 'react-redux';
import LayoutLoader from './LayoutLoaderWrapper';

const mapStateToProps = state => ({
  data: state.vertx,
});

export default connect( mapStateToProps )( LayoutLoader );
