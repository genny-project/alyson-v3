import React, { PureComponent } from 'react';
import { string, bool, array, number, any } from 'prop-types';
import { Box, Text, Icon } from '../../components';

const statusColors = {
  error: '#cc0000',
  warning: '#FFCC00',
  success: '#5cb85c',
};

class BucketList extends PureComponent {
  static defaultProps = {
    contentPadding: 10,
    contentGutter: 10,
    contentBackground: 'grey',
    showHeader: true,
    headerText: 'Bucket Title',
    headerColor: 'white',
    headerHeight: 50,
    headerBackground: 'darkgrey',
    headerPadding: 0,
    showLegend: true,
    legend: [],
    legendText: 'Bucket Legend',
    legendBackground: 'white',
    legendPadding: 10,
    legendMargin: 10,
    legendColor: 'black',
    roundCorners: true,
  }

  static propTypes = {
    children: any,
    contentPadding: number,
    contentGutter: number,
    contentBackground: string,
    showHeader: bool,
    headerText: string,
    headerIcon: string,
    headerHeight: number,
    headerColor: string,
    headerBackground: string,
    headerPadding: number,
    showLegend: bool,
    legend: array,
    legendText: string,
    legendIcon: string,
    legendBackground: string,
    legendPadding: number,
    legendMargin: number,
    legendColor: string,
    roundCorners: bool,
  }

  render() {
    const {
      children,
      contentBackground,
      contentPadding,
      contentGutter,
      showHeader,
      headerText,
      headerIcon,
      headerHeight,
      headerBackground,
      headerColor,
      headerPadding,
      showLegend,
      legend,
      legendText,
      legendIcon,
      legendBackground,
      legendPadding,
      legendMargin,
      legendColor,
      roundCorners,
    } = this.props;

    return (
      <Box
        flexDirection="column"
        justifyContent="flex-start"
        width="100%"
        backgroundColor={contentBackground}
      >
        {showHeader && (
          <Box
            justifyContent="center"
            alignItems="center"
            width="100%"
            height={headerHeight}
            backgroundColor={headerBackground}
            position="sticky"
            top={0}
            margin={headerPadding}
            zIndex={5}
          >
            {headerIcon ? (
              <Box
                marginRight={5}
              >
                <Icon
                  name={headerIcon}
                  color={headerColor}
                />
              </Box>
            ) : null}

            {headerText ? (
              <Text
                fontWeight="bold"
                color={headerColor}
              >
                {headerText}
                &nbsp;
                {(
                  children &&
                  children instanceof Array &&
                  children.length > 0
                )
                  ? `(${children.length})`
                  : '(0)'}
              </Text>
            ) : null}
          </Box>
        )}

        <Box
          justifyContent="center"
          width="100%"
          flexDirection="column"
          padding={contentPadding}
        >
          {(
            children &&
            children instanceof Array &&
            children.length > 0
          ) ? (
              children.map(( child, index ) => (
                <Box
                  key={child.props.id}
                  marginBottom={index < children.length - 1 ? contentGutter : null}
                >
                  {child}
                </Box>
              ))
            ) : (
              <Text
                align="center"
                color="white"
              >
              No Items To Display
              </Text>
            )}
        </Box>

        {(
          showLegend &&
          legend &&
          legend instanceof Array &&
          legend.length > 0
        ) && (
          <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            position="sticky"
            bottom={0}
            width="100%"
            padding={legendMargin}
          >
            <Box
              flexDirection="column"
              justifyContent="center"
              width="100%"
              backgroundColor={legendBackground}
              borderRadius={roundCorners ? 5 : 0}
              padding={legendPadding}
            >
              <Box
                justifyContent="center"
              >
                <Text
                  fontWeight="bold"
                  color={legendColor}
                >
                  Legend
                </Text>
              </Box>

              {legend.map(( item ) => (
                <Box
                  key={item && item.id}
                  alignItems="center"
                >
                  <Box
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      color={legendColor}
                    >
                      {legendIcon && (
                        <Box
                          marginRight={5}
                        >
                          <Icon
                            name={legendIcon}
                            color={legendColor}
                          />
                        </Box>
                      )}

                      {legendText && (
                        <Text
                          fontWeight="bold"
                          color={legendColor}
                        >
                          {legendText}
                        </Text>
                      )}
                    </Text>
                  </Box>

                  <Box
                    backgroundColor={statusColors[item.status]}
                    width={10}
                    height={10}
                    borderRadius="50%"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

export default BucketList;
