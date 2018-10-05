import React, { Component } from 'react';
import { string, array, number, bool, oneOfType } from 'prop-types';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';
import './table.scss';

const utilMethod = ( filter, rows ) => {
  // const rows1 = Array.from( rows );

  // console.warn( filter,rows, '$$$$$$$$$ ' );
  // const a =  rows1.filter( x =>  x.firstName.includes( 'anish' ));

  // return a;

  return  matchSorter( rows, filter.value, { keys: ['firstName'] });
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

   addFilterMethodsToColumn =  () => { 
     const { columns  } = this.props;

     if ( columns.length < 1 ) return null;
     const modifiedCells = columns.map( column => { 
       if ( column.filterType === 'string' ) { 
         return ( [{ ...column, ...({ filterMethod: column['filterMethod'] = utilMethod }), ...{ filterAll: true } }] );
       }

       return column['filterMethod'] = 'filter2';
     });

      // if user passes a table cell as a component other than string, number
      // we need to handle it specificially and combine the data
    //  const combineCustomComponent = () => {
    //    if ( customComponent ) { 
    //      columns.map( column => {
    //        return; 
    //      });
    //    }
    //  };

     return modifiedCells;
   }

   render() {
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

     tableStyleProps.push( 
       tableHeight,
       tableWidth,
       tableBackgroundColor,
       containerBackgroundColor );
     console.warn( this.props, 'props *********************************' );
     this.addFilterMethodsToColumn();

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
           defaultFilterMethod={( filter, row ) =>
             String( row[filter.id] ) === filter.value}
           showPagination={data.length > itemsPerPage ? true : false}

         />
       </div>
     );
   }
}

export default TableView;
