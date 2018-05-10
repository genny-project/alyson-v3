import React, { Component } from 'react';
import { string, bool, array, number, oneOf } from 'prop-types';
import { Box, Text, Icon } from '../../components';

class BucketList extends Component {
  static defaultProps = {
    items: [],
    color: 'success',
    gutter: 10,
    contentPadding: 10,
    contentBackground: 'grey',
    showHeader: true,
    headerText: 'Bucket Title',
    headerIcon: 'email',
    headerColor: 'white',
    headerHeight: 50,
    headerBackground: 'darkgrey',
    headerPadding: 0,
    showLegend: true,
    legend: [],
    legendBackground: 'white',
    legendPadding: 10,
    legendMargin: 10,
    legendColor: 'black',
  }

  static propTypes = {
    items: array,
    gutter: number,
    contentPadding: number,
    color: oneOf(
      ['warning', 'success', 'error']
    ),
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
    legendBackground: string,
    legendPadding: number,
    legendMargin: number,
    legendColor: string,
  }

  render() {
    const {
      items,
      color,
      contentBackground,
      contentPadding,
      gutter,
      showHeader,
      headerText,
      headerIcon,
      headerHeight,
      headerBackground,
      headerColor,
      headerPadding,
      showLegend,
      legend,
      legendBackground,
      legendPadding,
      legendMargin,
      legendColor,
    } = this.props;
    
    const statusColors = { 
      error: '#cc0000',
      warning: '#FFCC00',
      success: '#5cb85c',
    };

    return (
      <Box
        flexDirection='column'
        justifyContent='flex-start'
        width='100%'
        height='100%'
        backgroundColor={contentBackground}
      >
        { showHeader && (
          <Box
            justifyContent='center'
            alignItems='center'
            width='100%'
            height={headerHeight}
            backgroundColor={headerBackground}
            position='sticky'
            top={0}
            margin={headerPadding}
          >
            { headerIcon && (
              <Box
                marginRight={5}
              >
                <Icon
                  name={headerIcon}
                  color={headerColor}
                />
              </Box>
            )}
            { headerText && (
              <Text
                fontWeight='bold'
                color={headerColor}
              >
                {headerText} ({(
                  items &&
                  items instanceof Array &&
                  items.length > 0 
                ) ? (
                  `${items.length}`
                ) : (
                  '0'
                )})
              </Text>
            )}
          </Box>
        )}
        <Box
          justifyContent='center'
          width='100%'
          flexDirection='column'
          padding={contentPadding}
        >
          {(
            items &&
            items instanceof Array &&
            items.length > 0 
          ) ? (
            items.map(( item, index ) => {
              return (
                <Box
                  key={item && item.id}
                  alignItems='center'
                  justifyContent='center'
                  width='100%'
                  height={200}
                  backgroundColor='red'
                  marginBottom={
                    index < items.length - 1 ?
                    gutter :
                    null
                  }
                >
                  {(
                    item &&
                    item.content &&
                    (
                      <Text>{item.content}</Text>
                    )
                  )}
                </Box>
              );
            })
          ) : (
            <Text>
              No Items To Display
            </Text>
          )}
        </Box>

        {(
          showLegend &&
          legend &&
          legend instanceof Array &&
          legend.length > 0 ) &&
          (
            <Box
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              position='sticky'
              bottom={0}
              width='100%'
              padding={legendMargin}
            >
              <Box
                flexDirection='column'
                justifyContent='center'
                width='100%'
                backgroundColor={legendBackground}
                borderRadius={5}
                padding={legendPadding}
              >
                <Box
                  justifyContent='center'
                >
                  <Text
                    fontWeight='bold'
                    color={legendColor}
                  >
                    Legend
                  </Text>  
                </Box>
                {
                  legend.map(( item ) => (
                    <Box
                      key={item && item.id}
                      alignItems='center'
                    >
                      <Box
                        flex={1}
                        justifyContent='center'
                      >
                        <Text
                          color={legendColor}
                        >
                          {item.text}
                        </Text>
                      </Box>
                      <Box
                        backgroundColor={statusColors[color]}
                        width={10}
                        height={10}
                        borderRadius='50%'
                      />
                    </Box>
                  ))
                }
              </Box>
            </Box>
          )
        }
      </Box>
    );
  }
}

export default BucketList;
