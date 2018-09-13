import React, { Component } from 'react';
import range from 'lodash.range';
import { string, number, object, func } from 'prop-types';
import { Box, Icon } from '../../../components';

class TabDots extends Component {
  static defaultProps = {
    dotColor: 'black',
    dotSize: 'xs',
    dotOpacity: 0.25,
    currentDotOpacity: 0.75,
    dotIcon: 'fiber_manual_record',
    containerPadding: {
      paddingY: 5,
    },
    dotPadding: {},
  }

  static propTypes = {
    numberOfDots: number.isRequired,
    currentIndex: number.isRequired,
    dotColor: string,
    currentDotColor: number,
    dotSize: string,
    currentDotSize: number,
    dotOpacity: number,
    currentDotOpacity: number,
    dotIcon: string,
    currentDotIcon: string,
    backgroundColor: string,
    containerPadding: object,
    dotPadding: object,
    changeIndexOnPress: func,
  }

  onHandlePress = ( event ) => {
    if ( this.props.changeIndexOnPress ) this.props.changeIndexOnPress( event );
  }

  render() {
    const {
      numberOfDots,
      currentIndex,
      dotColor,
      currentDotColor,
      dotSize,
      currentDotSize,
      dotOpacity,
      currentDotOpacity,
      dotIcon,
      currentDotIcon,
      backgroundColor,
      containerPadding,
      dotPadding,
    } = this.props;

    return (
      <Box
        {...containerPadding}
        width="100%"
        justifyContent="center"
        backgroundColor={backgroundColor || null}
      >
        <Box>
          {
            range( numberOfDots )
              .map( i => {
                const isCurrent = i === currentIndex;

                return (
                  <Box
                    {...dotPadding}
                    key={i}
                    opacity={
                      isCurrent
                        ? currentDotOpacity || dotOpacity
                        : dotOpacity
                    }
                    changeIndexOnPress={this.onHandlePress}
                  >
                    <Icon
                      name={
                        isCurrent
                          ? currentDotIcon || dotIcon
                          : dotIcon
                      }
                      size={isCurrent
                        ? currentDotSize || dotSize
                        : dotSize}
                      color={
                        isCurrent
                          ? currentDotColor || dotColor
                          : dotColor
                      }
                    />
                  </Box>
                );
              })
            }
        </Box>
      </Box>
    );
  }
}

export default TabDots;
