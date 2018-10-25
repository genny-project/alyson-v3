import React, { Component, Fragment } from 'react';
import { string, array, number, bool, oneOfType } from 'prop-types';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import  debounce  from 'lodash.debounce';

import 'react-table/react-table.css';
import { Bridge } from '../../../utils/vertx';
import {  Text, Box, EventTouchable } from '../../components';

import './table.scss';

const utilMethod = ( filter, rows ) =>  {
  return matchSorter( rows, filter.value, { keys: [filter.id] });
};

class TableView extends Component {
  static defaultProps = {
    columns: [],
    data: [],
    itemsPerPage: 10,
    filterable: true,
    tableBackgroundColor: '#fff',
    tableHeight: 200,
    tableWidth: '100%',
    containerBackgroundColor: '#fff',
    buttonTextColor: '#fff',
  };

  static propTypes = {
    columns: array,
    data: array,
    itemsPerPage: number,
    filterable: bool,
    tableBackgroundColor: string,
    tableHeight: oneOfType( [number, string] ),
    tableWidth: oneOfType( [number, string] ),
    containerBackgroundColor: string,
    buttonTextColor: string,
  };

  constructor( props ) {
    super( props );

    this.sendMessageToBridge = debounce( this.sendMessageToBridge, 500 );
  }
 
  handleCellDataChange = cellInfo1 => event => {
    const { value } = event.target;

    console.warn({ cellInfo1, value });

    /* Send data to the bridge */
    this.sendMessageToBridge({
      attributeCode: cellInfo1.column.attributeCode,
      sourceCode: cellInfo1.column.sourceCode,
      targetCode: cellInfo1.column.targetCode,
      value: value,
    });
  }

  sendMessageToBridge = message => {
    return Bridge.sendAnswer( [message] );
  };

  modifiedTableColumns = () => {
    /* make all the columns searchable  this is used for searching oneach column */
    const addFilterMethodsToColumn =  () => {
      const { columns   } = this.props;
      
      if ( columns.length < 1 ) return null;
      const modifiedCells = columns.map( column => {
        return ({ ...column, ...{ filterMethod: utilMethod }, ...{ filterAll: true } });
      });
 
      console.log({ modifiedCells });

      return modifiedCells;
    };
    
    /* add buttons to the data (if it is asked in - in the props) */
    const addCustomComponentsToColumn = () => {
      const { data, buttonTextColor } = this.props;
      const modifiedData = addFilterMethodsToColumn();

      console.warn( modifiedData );

      const renderButtons = ( cellInfo, buttonComponents ) => {
        const handleClick = ( e ) => { 
          Bridge.sendEvent({
            event: 'BTN',
            eventType: 'BTN_CLICK',
            sendWithToken: true,
            data: {
              code: e.btnCode,
              /* Backend expects a stringified json inside the value data */
              value: JSON.stringify({
                itemCode: cellInfo.original.attributeCode,
              }),
              itemCode: cellInfo.original.attributeCode,
            },
          });
        };
        
        console.warn({ cellInfo }, '%%%%%%%%%%%%%%%%%%' );
        const renderButtons2 = () => {
          /* check if buttonComponents data is passed from the */
          /* props if then render those buttons inside the table */
          if ( buttonComponents && buttonComponents.length > 0 ) { 
            return buttonComponents.map( btn => (
              <Box key={btn.text}>
                <EventTouchable
                  size="sm"
                  color="green"
                  width={50}
                  height={50}
                  textColor={buttonTextColor}
                  onClick={() => handleClick( btn )}
                >
                  <Text>
                    {btn.text}
                  </Text>
                </EventTouchable>
              </Box>
            ));
          }
           
          return (
            <Fragment>

              {data[cellInfo.index][cellInfo.column.id]}
            </Fragment>
          );
        };
        
        return (
          <Box
            justifyContent="space-around"
            height="100%"
          >
            {renderButtons2()}

          </Box>
        );
      };

      /* method for adding an extra data */
      const addButtonsToModifiedData = modifiedData.map(
        data => ({ ...data, Cell: cellInfo => renderButtons( cellInfo, data.buttonComponent ) })
      );

      return addButtonsToModifiedData;
    };

    return addCustomComponentsToColumn();
    /* method to  add custom components on each Cell */
  }

  render() {
    const {
      data,
      itemsPerPage,
      filterable,
      tableBackgroundColor,
      tableWidth,
      containerBackgroundColor,
      tableHeight,
    } = this.props;

    const tableStyleProps = [];

    tableStyleProps.push( 
      tableHeight,
      tableWidth,
      tableBackgroundColor,
      containerBackgroundColor );
    
    return (
      <div style={{ backgroundColor: containerBackgroundColor, width: tableWidth }}>
        <ReactTable
          className="react-tbl table -striped -highlight"
          style={[tableStyleProps]}
          showPageSizeOptions={false}
          noDataText="No data to Display."
          filterable={filterable}
          data={data}
          columns={this.modifiedTableColumns()}
          pageSize={itemsPerPage}
          showPagination={data.length > itemsPerPage ? true : false}
        />
      </div>
    );
  }
}

export default TableView;
