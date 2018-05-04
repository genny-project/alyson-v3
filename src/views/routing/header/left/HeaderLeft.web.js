import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import config from '../../../../config';
import { Link, Button, Box, Heading } from '../../../components';
import { toggleSidebar } from '../../../../redux/actions';

class HeaderLeft extends Component {
  static propTypes = {
    toggleSidebar: func,
    baseEntities: object,
    aliases: object,
  }

  render() {
    const { toggleSidebar, baseEntities, aliases } = this.props;
    const projectAttributes = baseEntities.attributes[aliases.PROJECT];

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
            {(
              projectAttributes &&
              projectAttributes.PRI_NAME &&
              projectAttributes.PRI_NAME.valueString
            ) || (
              config.app.name
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
