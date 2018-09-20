import React, { Component } from 'react';
import { string, array, number, bool, oneOfType } from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './table.scss';

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

  /* react table requires to create a accessor property from the data we receive */
  /* we take each object from the prop and add accessor property to the object */
  /* create accessor if doesnt exists  TODO*/
  createAccesorForColumns = () => {
    const newData = this.props.columns.map( data => ({
      ...data,
      ...{ accessor: data.Header.split( ' ' ).join() },
    }));

    return newData;
  };

  render() {
    console.warn( this.props );
    const {
      columns,
      data,
      itemsPerPage,
      filterable,
      tableBackgroundColor,
      tableWidth,
      containerBackgroundColor,
      tableHeight,
    } = this.props;

    const tableStyleProps = [];

    tableStyleProps.push( tableHeight, tableWidth, tableBackgroundColor, containerBackgroundColor );

    return (
      <div style={{ backgroundColor: containerBackgroundColor, width: tableWidth }}>
        <ReactTable
          className="react-tbl table -striped -highlight"
          style={[tableStyleProps]}
          showPageSizeOptions={false}
          noDataText="No data to Display."
          data={data}
          columns={columns}
          pageSize={itemsPerPage}
          filterable={filterable}
          defaultFilterMethod={( filter, row ) => {
            return row[filter.id].value.includes( filter.value );
          }}
          // resizable={false}
          showPagination={data.length > itemsPerPage ? true : false}
        />
      </div>
    );
  }
}

export default TableView;
