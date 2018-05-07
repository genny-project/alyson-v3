import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dlv from 'dlv';
import config from '../../../../config';
import { Link, Button, Box, Heading } from '../../../components';
import { toggleSidebar } from '../../../../redux/actions';

const LOADING_TEXT_DURATION = 1000;

class HeaderLeft extends Component {
  static propTypes = {
    toggleSidebar: func,
    baseEntities: object,
    aliases: object,
  }

  state = {
    showLoadingText: true,
  }

  componentDidMount() {
    this.startProjectNameTimer();
  }

  componentWillUnmount() {
    if ( this.timer != null )
     clearTimeout( this.timer );
  }

  startProjectNameTimer() {
    this.timer = setTimeout(() => {
      this.setState({
        showLoadingText: false,
      });
    }, LOADING_TEXT_DURATION );
  }

  render() {
    const { toggleSidebar, baseEntities, aliases } = this.props;
    const { showLoadingText } = this.state;
    const projectAlias = dlv( aliases, 'PROJECT' );
    const projectName = dlv( baseEntities, `attributes.${projectAlias}.PRI_NAME.valueString` );

    return (
      <Box
        alignItems="center"
      >
        <Button
          onPress={toggleSidebar}
          size="lg"
          color="transparent"
          textColor="white"
          icon="menu"
          paddingX={10}
        />

        <Link to="home">
          <Heading
            size="md"
            marginY={0}
            color="white"
          >
            {projectName || (
              showLoadingText
                ? 'Loading...'
                : config.app.name
            )}
          </Heading>
        </Link>
      </Box>
    );
  }
}

export { HeaderLeft };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  aliases: state.vertx.aliases,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ toggleSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( HeaderLeft );
