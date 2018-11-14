import React, { Component, Fragment, isValidElement } from 'react';
import { string, array, number, bool, oneOfType } from 'prop-types';
import ReactTable from 'react-table';

import matchSorter from 'match-sorter';
import  debounce  from 'lodash.debounce';

import 'react-table/react-table.css';
import { Bridge, isArray } from '../../../utils';
import {   Box, Recursive } from '../../components';

import './table.css';

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
      const { columns  } = this.props;
      
      if ( columns.length < 1 ) return null;
      const modifiedCells = columns.map( column => {
        return ({ ...column, ...{ filterMethod: utilMethod }, ...{ filterAll: true } });
      });

      return modifiedCells;
    };

    const sendTableSelectEventMessage = ( dd, fullData ) => {
      console.warn( this.props.data, 'DATA IN EVENT MSG' );
      console.warn({ dd });
      console.warn({ fullData });
      Bridge.sendEvent({
        event: 'BTN',
        eventType: 'BTN_CLICK',
        sendWithToken: true,
        data: {
          code: 'BTN_TABLE_SELECT',
          value: JSON.stringify({ itemCode: '' , hint: 'GRP_EDU_PROVIDERS', userCode: 'PER_AGENT_AT_AGENTCOM' }),
        },
      });
    };

    const renderCell = ( cellInfo, data ) => {
      const { renderButton } = data;

      if ( renderButton ) { 
        const context = {
          ...this.props.context, // eslint-disable-line
          ...this.props.data[cellInfo.index],
        };

        console.warn({ context });
            
        return (
          <Box
            justifyContent="space-around"
            height="100%"
          >
            {renderButton ? (
              isValidElement( renderButton ) ? renderButton
              : isArray( renderButton )
                ? renderButton.map(( element, i ) => (
                  isValidElement( element ) ? element : (
                    <Recursive
                          key={i} // eslint-disable-line
                      {...element}
                      context={context}
                    />
                  )))
                : (
                  <Recursive
                    {...renderButton}
                    context={context}
                  />
                )
            ) : null}
          </Box>
        );
      }
           
      return (
        <Fragment>
          <div
            style={{ backgroundColor: 'red', cursor: 'pointer' }}
            onClick={() => sendTableSelectEventMessage( cellInfo , 1 )}
          >
            {this.props.data[cellInfo.index][cellInfo.column.id]}
          </div>
        </Fragment>
      );
    };

    const aa =  addFilterMethodsToColumn().map(
      data => ({ ...data, Cell: cellInfo => renderCell( cellInfo, data ) })
    );
    
    return aa;
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
