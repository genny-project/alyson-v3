import React, { Component } from 'react';
import { string, array, number, bool, oneOfType } from 'prop-types';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

// import { Button, Text, Box } from '../../components';
// import { Bridge } from '../../../utils/vertx';

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
  };

  modifiedTableColumns = () => {
    /* make all the columns searchable  this is used for searching oneach column */
    const addFilterMethodsToColumn =  () => {
      const { columns   } = this.props;

      if ( columns.length < 1 ) return null;
      const modifiedCells = columns.map( column => {
        return ({ ...column, ...{ filterMethod: utilMethod }, ...{ filterAll: true } });
      }); 
 
      return modifiedCells;
    };

    const addCustomComponentsToColumn = () => { 
      const modifiedData = addFilterMethodsToColumn();

      console.warn( this.props, 'PROPS LOG FROM ADD CUSTOM COMPONENTS TO COLUMN' );

      return modifiedData;
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
    // this.addFilterMethodsToColumn();

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

/* input style redundant right now while testing */
// const inputStyle = {
//   border: 'none',
//   height: '100%',
//   width: '100%',
//   padding: 4,

// };
