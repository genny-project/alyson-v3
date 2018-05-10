import React, { Component } from 'react';
import { string, bool, array, number, oneOf, any } from 'prop-types';
import { Box, Text, Icon } from '../../components';

class BucketList extends Component {
  static defaultProps = {
    color: 'success',
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
    roundCorners: true,
  }

  static propTypes = {
    children: any,
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
    roundCorners: bool,
  }

  render() {
    const {
      children,
      color,
      contentBackground,
      contentPadding,
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
      roundCorners,
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
                  children &&
                  children.length > 0 
                ) ? (
                  `${children.length}`
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
            children &&
            children.length > 0 
          ) ? (
            children.map(( child ) => {
              return ( child );
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
                borderRadius={roundCorners ? 5 : 0}
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
