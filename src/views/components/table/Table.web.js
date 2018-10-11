import React, { Component } from 'react';
import { string, array, number, bool, oneOfType } from 'prop-types';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

import { Button, Text, Box } from '../../components';
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

   addFilterMethodsToColumn =  () => {
     const { columns   } = this.props;

     /* add filtermethod to all the columns */
     /* This is used for searching */

     if ( columns.length < 1 ) return null;
     const modifiedCells = columns.map( column => { 
       return ({ ...column, ...{ filterMethod: utilMethod }, ...{ filterAll: true } });
     }); 

     const textInputForEditable = () => {
       return (
         <Box
           width="100%"
           justifyContent="space-around"
           display="flex"
           flexDirection="row"
         >
           <Button
             size="sm"
             color="green"
           >
             <Text color="white">
              View
             </Text>
           </Button>

           <Button
             size="sm"
             color="green"
           >
             <Text color="white">
              Edit
             </Text>
           </Button>

         </Box>
       );
     };

     /* if editable is provided as a props  then wrap that cell with a text input */
     const makeEditableData = modifiedCells.map( row => {
       if ( row && row.editable ) {
         return ({ ...row, ...{ Cell: textInputForEditable() } });
       }

       return row;
     });

     console.warn( modifiedCells, ' $$$$$$$$$$$$$$$$$$$ modified cells' );
     console.warn( makeEditableData, ' $$$$$$$$$$$$$$$$$$$$ make Editable Cells ' );
     console.warn( this.props.data, ' $$$$$$$$$$$$$$$$$$$$$$$$$$$' );

     return makeEditableData;
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
           columns={this.addFilterMethodsToColumn()}
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
