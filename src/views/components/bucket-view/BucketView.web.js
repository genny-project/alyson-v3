import React, { PureComponent } from 'react';
import { string, number, any, object } from 'prop-types';
import { isArray, getDeviceSize } from '../../../utils';
import { Box, Text, Touchable, Icon } from '../../components';

// let containerWidth = null;

class BucketView extends PureComponent {
  static defaultProps = {
    testID: 'bucket-view',
  }

  static propTypes = {
    children: any,
    padding: number,
    gutter: number,
    backgroundColor: string,
    alternateBackgroundColor: string,
    contentProps: object,
    testID: string,
  }

  state = {
    currentBucket: getDeviceSize() === 'sm' ? 0 : null,
  }

  handlePressPrevious = () => {
    if ( this.state.currentBucket > 0 ) {
      this.setState( state => ({
        currentBucket: state.currentBucket - 1,
      }));
    }
  }

  handlePressNext = () => {
    if ( this.state.currentBucket < this.props.children.length - 1 ) {
      this.setState( state => ({
        currentBucket: state.currentBucket + 1,
      }));
    }
  }

  // handleContainerWidth = ( event ) => {
  //   // var { width } = event.nativeEvent.layout;

  //   // console.log( width );

  //   // if ( width ) {
  //   //   containerWidth = width;
  //   // }
  // }

  render() {
    const {
      padding,
      gutter,
      backgroundColor,
      alternateBackgroundColor,
      children,
      contentProps,
      testID,
      ...restProps
    } = this.props;

    return (
      <Box
        {...restProps}
        width="100%"
        height="100%"
        padding={padding}
        backgroundColor={backgroundColor}
        testID={testID}
        {...getDeviceSize() === 'sm'
          ? {
            position: 'relative',
          }
          : {}
        }
      >
        {
          getDeviceSize() === 'sm' &&
          this.state.currentBucket > 0
            ? (
              <Box
                width={30}
                height="100%"
                position="absolute"
                top={0}
                left={0}
                zIndex={40}
                alignItems="center"
                justifyContent="center"
              >
                <Touchable
                  withFeeback
                  onPress={this.handlePressPrevious}
                >
                  <Box
                    opacity={0.25}
                    width={25}
                    height={50}
                    backgroundColor="black"
                    borderRadius={5}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      name="chevron_left"
                      color="white"
                    />
                  </Box>
                </Touchable>
              </Box>
            )
            : null
        }
        {
          getDeviceSize() === 'sm' &&
          this.state.currentBucket < this.props.children.length - 1
            ? (
              <Box
                width={30}
                height="100%"
                position="absolute"
                top={0}
                right={0}
                zIndex={40}
                alignItems="center"
                justifyContent="center"
              >
                <Touchable
                  withFeeback
                  onPress={this.handlePressNext}
                >
                  <Box
                    opacity={0.25}
                    backgroundColor="black"
                    width={25}
                    height={50}
                    borderRadius={5}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      name="chevron_right"
                      color="white"
                    />
                  </Box>
                </Touchable>
              </Box>
            )
            : null
        }
        <Box
          width="100%"
          flex={1}
          {...getDeviceSize() === 'sm'
            ? {
              overflowX: 'hidden',
            }
            : {}
          }
        >
          <Box
            {...getDeviceSize() === 'sm'
              ? {
                onLayout: this.handleContainerWidth,
              }
              : {
                width: '100%',
                flex: 1,
              }
            }
          >
            {isArray( children, { ofMinLength: 1 }) ? (
              children.map(( child, index ) => (
                <Box
                  key={child.props.id || index}
                  flex={1}
                  backgroundColor={index % 2 === 0 && alternateBackgroundColor}
                  marginRight={(
                    index < children.length - 1 &&
                    getDeviceSize() !== 'sm'
                      ? gutter
                      : null
                  )}
                  {...contentProps}
                  {...getDeviceSize() === 'sm'
                    ? {
                      minWidth: '100vw',
                      transform: `translate(-${100 * this.state.currentBucket}%, 0)`,
                      transitionDuration: '300ms',
                      transitionProperty: 'transform',
                      transitionTimingFunction: 'ease',
                    }
                    : {}
                  }
                >
                  {child}
                </Box>
              ))
            ) : (
              <Text>
                No items to display
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default BucketView;
