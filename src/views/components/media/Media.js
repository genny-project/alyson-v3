import React, { PureComponent, Fragment } from 'react';
import { node, string, array, object, oneOfType, oneOf } from 'prop-types';
import { Box, Image, Text, Heading } from '../../components';

class Media extends PureComponent {
  static defaultProps = {
    headerProps: {},
    description: '',
    descriptionProps: {},
    imageSize: 'sm',
    imageProps: {},
  }

  static propTypes = {
    header: oneOfType(
      [string, array]
    ).isRequired,
    headerProps: object,
    description: oneOfType(
      [string, array]
    ),
    descriptionProps: object,
    image: string.isRequired,
    imageSize: oneOf(
      ['sm', 'md', 'lg']
    ),
    imageProps: object,
    children: node,
  }

  render() {
    const {
      children,
      header,
      headerProps,
      description,
      descriptionProps,
      image,
      imageSize,
      imageProps,
    } = this.props;

    const imageSizes = {
      sm: 50,
      md: 100,
      lg: 200,
    };

    return (
      <Box
        alignItems="center"
        justifyContent="center"
        width="100%"
        flexDirection="row"
      >
        {(
          image &&
          typeof image === 'string'
        ) ? (
          <Box
            marginRight={10}
          >
            <Image
              source={image}
              width={imageSizes[imageSize]}
              height={imageSizes[imageSize]}
              {...imageProps}
            />
          </Box>
          ) : null}

        <Box
          flex={1}
          width="100%"
          justifyContent="flex-start"
          flexDirection="column"
        >
          {(
            children
          ) ? children
            : (
              <Fragment>
                {(
                  header &&
                  header instanceof Array &&
                  header.length > 0
                ) ? (
                    header.map( headerItem => (
                      <Heading
                        key={headerItem}
                        {...headerProps}
                      >
                        {headerItem}
                      </Heading>
                    ))
                  ) : (
                    <Heading
                      {...headerProps}
                    >
                      {header}
                    </Heading>
                  )
                }
                {(
                  description &&
                  description instanceof Array &&
                  description.length > 0
                ) ? (
                    description.map( descriptionItem => (
                      <Text
                        key={descriptionItem}
                        {...descriptionProps}
                      >
                        {descriptionItem}
                      </Text>
                    ))
                  ) : (
                    <Text
                      {...descriptionProps}
                    >
                      {description}
                    </Text>
                  )
                }
              </Fragment>
            )
        }
        </Box>
      </Box>
    );
  }
}

export default Media;
