import React, { Component, isValidElement } from 'react';
import { string, array, number, bool, oneOfType, object } from 'prop-types';
import ReactTable from 'react-table';

import matchSorter from 'match-sorter';
import  debounce  from 'lodash.debounce';

import 'react-table/react-table.css';
import { Bridge, isArray } from '../../../utils';
import {   Box, Recursive } from '../../components';

/* testing table for rendering the number of items */
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
    renderWrapper: object,
  };

  constructor( props ) {
    super( props );

    this.sendMessageToBridge = debounce( this.sendMessageToBridge, 500 );
  }
 
  handleCellDataChange = cellInfo1 => event => {
    this.renderNumberOfItems();
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

    const renderCell = ( cellInfo, data ) => {
      const { renderWrapper } = this.props;
      const { renderButton } = data;

      if ( renderButton ) {
        const context = {
          ...this.props.context, // eslint-disable-line
          ...this.props.data[cellInfo.index],
        };
            
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
      const celld = this.props.data[cellInfo.index][cellInfo.column.id];
      const rowd = this.props.data[cellInfo.index];

      return (
        <Recursive
          {...renderWrapper}
          context={{
            celld: rowd,
          }}
        >
          {celld}
        </Recursive>
      );
    };

    return addFilterMethodsToColumn().map(
      data => ({ ...data, Cell: cellInfo => renderCell( cellInfo, data ) })
    );
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
        <div
          className="table-custom-footer"
          style={customFooterStyle}
        > 
          <p>
            Number of Records: 
            {' '}
            {data && data.length}
          </p>
        </div>

        { isArray( data ) ? (

          <ReactTable
            className="react-tbl table -striped -highlight"
            style={[tableStyleProps]}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            showPageSizeOptions
            noDataText="No data to Display."
            filterable={filterable}
            data={data}
            columns={this.modifiedTableColumns()}
            pageSize={itemsPerPage}
            showPagination={data.length > itemsPerPage ? true : false}
          />
        ) : null}
      </div>
    );
  }
}

const customFooterStyle = { 
  height: '30px',
  padding: '10px',
  paddingLeft: '20px',
};

export default TableView;
