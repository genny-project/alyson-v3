import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Button, Box, Heading } from '../../../components';
import { toggleSidebar } from '../../../../redux/actions';

class HeaderLeft extends Component {
  static propTypes = {
    toggleSidebar: func,
  }

  render() {
    const { toggleSidebar } = this.props;

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
            Genny
          </Heading>
        </Link>
      </Box>
    );
  }
}

export { HeaderLeft };

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ toggleSidebar }, dispatch );
};

export default connect( null, mapDispatchToProps )( HeaderLeft );
