// import React, { Component } from 'react';
// import { object, array } from 'prop-types';
// import { Header, HeaderCell,Row, Cell,DataTable } from 'react-native-data-table';

import { Box } from '../../components';

export default Box;
/**
class TableView extends Component {
  defaultProps = {
    headerData: [],
    rowData: [],
    data: [],
    headerCellStyle: {},
    headerCellTextStyle: {},
    headerStyle: {  },
    rowStyle: {},
    rowCellStyle: {},
    rowCellTextStyle: {},
    tableStyle: {},
    listViewStyle: {},
  }

  propTypes = {
    headerData: array,
    rowData: array,
    headerCellStyle: object,
    headerCellTextStyle: object,
    headerStyle: object,
    rowStyle: object,
    rowCellStyle: object,
    rowCellTextStyle: object,
    tableStyle: object,
    listViewStyle: object,
  }

  constructor( props ) { 
    super( props );
    this.state = { 
      data: null,
    };
  }

  /* render the header part *//*
  renderHeader() {
    const { headerCellStyle, headerCellTextStyle, headerStyle } = this.props;
    const headerCells = [];

    this.props.headerData.map( eachData => 
      headerCells.push(
        <HeaderCell
          key={eachData && eachData.key && eachData.key}
          style={headerCellStyle}
          textStyle={headerCellTextStyle}
          width={1}
          text={eachData}
        />
      ));

    return (
      <Header style={headerStyle}>
        {headerCells}
      </Header>
    );
  }
  
  /* Doing */
  /* render the row part this is a TODO once data format is known. *//*
  renderRow( item ) {
    const { rowStyle, rowCellStyle ,rowCellTextStyle, rowData } = this.props;

    const cells = [];
    const DataFromRow = rowData;

    if ( DataFromRow && DataFromRow.length > 0 ) {
      const firstObject = this.state.data[0];

      for ( const [key] of Object.entries( firstObject )) {
        let itemString = item[key]
          && (( typeof item[key] === 'string' )
          || ( typeof item[key] === 'number' )
          || ( typeof item[key].getMonth === 'function' ))
          && String( item[key] );

        if ( !itemString && item[key] && item[key].length ) itemString = item[key].length;
        if ( typeof item[key] === 'boolean' ) itemString = item[key] ? 'True' : 'False';
        if ( !itemString && item[key] && item[key].id ) itemString = item[key].id;
        
        cells.push(
          <Cell
            key={key}
            style={rowCellStyle}
            textStyle={rowCellTextStyle}
            width={1}
          >
            {itemString}
          </Cell>
        );
      }
    }

    return (
      <Row style={rowStyle}>
        {cells}
      </Row>
    );
  }

  render() { 
    const { listViewStyle, tableStyle } = this.props;

    return (
      <Box>
        <DataTable
          style={tableStyle}
          listViewStyle={listViewStyle}
          renderRow={this.renderRow}
          renderHeader={this.renderHeader}
        />
      </Box>
    );
  }
}

export default TableView;
*/
