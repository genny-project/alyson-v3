import React, { Component } from 'react';
import { Link, Button, Box, Heading } from '../../../components';

class HeaderLeft extends Component {
  render() {
    return (
      <Box
        alignItems="center"
      >
        <Button
          onPress={this.handleToggleMenu}
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

export default HeaderLeft;
