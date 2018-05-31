import React, { PureComponent } from 'react';
import { any, string, number, bool } from 'prop-types';
import { Box, Image } from '../../components';

const statusColors = {
  error: '#cc0000',
  warning: '#FFCC00',
  success: '#5cb85c',
};

class Card extends PureComponent {
  static defaultProps = {
    cardBackground: 'white',
    cardPadding: 10,
    headerBackground: 'white',
    headerPadding: 0,
    headerAlign: 'flex-start',
    contentBackground: 'white',
    contentPadding: 0,
    contentAlign: 'center',
    roundCorners: true,
    showImage: true,
    imageMargin: 10,
    showStatus: true,
    status: 'success',
    statusMargin: 10,
  }

  static propTypes = {
    children: any,
    cardBackground: string,
    cardPadding: number,
    headerBackground: string,
    headerPadding: number,
    headerAlign: string,
    contentBackground: string,
    contentPadding: number,
    contentAlign: string,
    roundCorners: bool,
    showImage: bool,
    image: string,
    imageMargin: number,
    showStatus: bool,
    status: string,
    statusMargin: number,
  }

  render() {
    const {
      children,
      cardBackground,
      cardPadding,
      headerBackground,
      headerPadding,
      headerAlign,
      contentBackground,
      contentPadding,
      contentAlign,
      roundCorners,
      showImage,
      image,
      imageMargin,
      showStatus,
      status,
      statusMargin,
      ...restProps
    } = this.props;

    const isChildrenArray = (
      children &&
      children instanceof Array
    );

    const firstChild = isChildrenArray && children[0];
    const otherChildren = isChildrenArray && children.slice( 1 );
    
    return (
      <Box
        {...restProps}
        alignItems="center"
        justifyContent="center"
        width="100%"
        backgroundColor={cardBackground}
        flexDirection="column"
        padding={cardPadding}
        borderRadius={roundCorners ? 5 : 0}
      >
        <Box
          width="100%"
          marginBottom={10}
        >
          {(
            showImage &&
            image
          ) ? (
            <Box
              marginRight={imageMargin}
            >
              <Image
                source={image}
                width={50}
                height={50}
              />
            </Box>
            ) : null}

          <Box
            flex={1}
            width="100%"
            justifyContent="centre"
            alignItems={headerAlign}
            flexDirection="column"
            backgroundColor={headerBackground}
            padding={headerPadding}
          >
            {firstChild}
          </Box>

          {(
            showStatus &&
            status
          ) ? (
            <Box
              marginLeft={statusMargin}
            >
              <Box
                width={10}
                height="100%"
                backgroundColor={statusColors[status] || status}
                borderRadius={5}
              />
            </Box>
            ) : null}
        </Box>

        <Box
          width="100%"
        >
          <Box
            padding={contentPadding}
            backgroundColor={contentBackground}
            justifyContent="centre"
            alignItems={contentAlign}
            flexDirection="column"
            width="100%"
          >
            {otherChildren}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Card;
