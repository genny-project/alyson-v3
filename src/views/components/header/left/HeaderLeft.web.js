import React, { Component } from 'react';
import { func, bool, string } from 'prop-types';
import { Link, Button, Box, Heading, Image } from '../../index';
import { LayoutConsumer } from '../../../layout';

class HeaderLeft extends Component {
  static propTypes = {
    toggleSidebar: func,
    showMenu: bool,
    showLogo: bool,
    showTitle: bool,
    logoSource: string,
    title: string,
  }

  render() {
    const {
      toggleSidebar,
      showMenu,
      showLogo,
      showTitle,
      logoSource,
      title,
    } = this.props;

    return (
      <LayoutConsumer>
        {layout => (
          <Box
            alignItems="center"
          >
            {showMenu ? (
              <Button
                onPress={toggleSidebar}
                size="lg"
                color="transparent"
                textColor={layout.textColor}
                icon="menu"
                paddingX={10}
              />
            ) : (
              <Box width={10} />
            )}

            {showLogo ? (
              <Box
                marginLeft={5}
                marginRight={15}
              >
                <Image
                  height="100%"
                  source={logoSource}
                />
              </Box>
            ) : null}

            {showTitle ? (
              <Link to="home">
                <Heading
                  size="md"
                  marginY={0}
                  color={layout.textColor}
                >
                  {title}
                </Heading>
              </Link>
            ) : null}
          </Box>
        )}
      </LayoutConsumer>
    );
  }
}

export default HeaderLeft;
