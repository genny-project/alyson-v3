import React, { PureComponent } from 'react';
import { string, bool, array, number, any, object } from 'prop-types';
import { isArray } from '../../../utils';
import { Box, Text, Icon, TestIdTooltip } from '../../components';

const statusColors = {
  error: '#cc0000',
  warning: '#FFCC00',
  success: '#5cb85c',
};

class List extends PureComponent {
  static defaultProps = {
    contentPadding: 10,
    contentGutter: 10,
    showHeader: true,
    headerText: 'Bucket Title',
    headerHeight: 50,
    headerPadding: 0,
    showLegend: true,
    legend: [],
    legendText: 'Bucket Legend',
    legendBackground: 'white',
    legendPadding: 10,
    legendMargin: 10,
    legendColor: 'black',
    emptyText: 'No items to show',
    testID: 'list',
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
    emptyProps: object,
    emptyTextProps: object,
    emptyText: string,
    headerProps: object,
    headerTextProps: object,
    showCountInHeader: bool,
    headerCountProps: object,
    headerCountTextProps: object,
    scrollViewProps: object,
    contentBodyProps: object,
    itemProps: object,
    testID: string,
  }

  render() {
    const {
      children,
      contentBackground,
      contentGutter,
      showHeader,
      headerText,
      headerIcon,
      headerColor,
      showLegend,
      legend,
      legendText,
      legendIcon,
      legendBackground,
      legendPadding,
      legendMargin,
      legendColor,
      roundCorners,
      emptyProps,
      emptyTextProps,
      emptyText,
      headerProps,
      headerTextProps,
      showCountInHeader,
      headerCountProps,
      headerCountTextProps,
      contentBodyProps,
      itemProps,
      testID,
      ...restProps
    } = this.props;

    return (
      <TestIdTooltip
        id={testID}
      >
        <Box
          {...restProps}
          flexDirection="column"
          justifyContent="flex-start"
          flex={1}
          flexShrink={0}
          backgroundColor={contentBackground}
          testID={testID}
        >
          {showHeader && (
            <Box
              zIndex={5}
              {...headerProps}
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
                <Text {...headerTextProps}>
                  {headerText}
                </Text>
              ) : null}

              {(
                showCountInHeader &&
                isArray( children )
              )
                ? (
                  <TestIdTooltip
                    id={`${testID} SEL_LIST_COUNT`}
                  >
                    <Box {...headerCountProps}>
                      <Text {...headerCountTextProps}>
                        {children.length}
                      </Text>
                    </Box>
                  </TestIdTooltip>
                ) : null}
            </Box>
          )}

          <Box
            flexDirection="column"
            {...contentBodyProps}
          >
            {isArray( children, { ofMinLength: 1 }) ? (
              children.map(( child, index ) => (
                <Box
                  key={child.props.id}
                  marginBottom={index < children.length - 1 ? contentGutter : null}
                  {...itemProps}
                >
                  {child}
                </Box>
              ))
            ) : (
              <Box {...emptyProps}>
                <Text {...emptyTextProps}>
                  {emptyText}
                </Text>
              </Box>
            )}
          </Box>

          {(
            showLegend &&
            isArray( legend, { ofMinLength: 1 })
          ) ? (
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
            ) : null}
        </Box>
      </TestIdTooltip>
    );
  }
}

export default List;
