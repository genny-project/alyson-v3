import React, { Component, isValidElement } from 'react';
import { string, array, number, bool, oneOfType, object } from 'prop-types';
import ReactTable from 'react-table';

import matchSorter from 'match-sorter';
import debounce from 'lodash.debounce';
import dlv from 'dlv';

import 'react-table/react-table.css';
import { Bridge, isArray, isObject, injectDataIntoProps } from '../../../utils';
import { store } from '../../../redux';
import { Box, Recursive, Touchable, Text } from '../../components';

/* testing table for rendering the number of items */
import './table.css';

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
    cellContext: object,
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
    isSelectable: bool,
    selectFirstItemOnMount: bool,
    dispatchActionOnChange: object,
    itemToSelectFirst: object,
    code: string,
  };

  constructor( props ) {
    super( props );

    this.sendMessageToBridge = debounce( this.sendMessageToBridge, 500 );
    this.handleFilteredChange = debounce( this.handleFilteredChange, 1000 );
  }

  state = {
    selectedItem: null,
    selectedFirstItemOnMount: false,
    currentPage: 0,
    totalPages: 1,
    isLoadingNextPage: false,
  }

  componentDidMount() {
    if ( this.props.selectFirstItemOnMount )
      this.selectFirstItem();

    this.resetTableData();
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( this.props.code !== prevProps.code ) {
      this.resetTableData();
    }

    if (
      this.props.selectFirstItemOnMount &&
      !this.state.selectedFirstItemOnMount
    ) {
      this.selectFirstItem();
    }

    if ( prevState.selectedItem !== this.state.selectedItem ) {
      const { dispatchActionOnChange } = this.props;
      const { selectedItem } = this.state;

      if ( dispatchActionOnChange ) {
        store.dispatch(
          injectDataIntoProps(
            dispatchActionOnChange,
            { code: selectedItem },
          )
        );
      }
    }
  }

  setTotalPages = () => {
    const { data, itemsPerPage } = this.props;

    return isArray( data, { ofMinLength: 1 }) ? Math.round( data.length / itemsPerPage ) : 1;
  }

  resetTableData = () => {
    this.setState({
      selectedItem: null,
      selectedFirstItemOnMount: false,
      currentPage: 0,
      totalPages: this.setTotalPages(),
      isLoadingNextPage: false,
    });
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

  utilMethod = ( filter, rows, column ) => {
    const result = matchSorter( rows, filter.value, { keys: [filter.id] });

    this.handleFilteredChange( column.attributeCode, filter.value );

    return result;
  };

  handleFilteredChange = ( attributeCode, value ) => {
    // const filteredCodes = JSON.stringify( items );
    const json = JSON.stringify({
      attributeCode: attributeCode,
      value: value,
    });

    Bridge.sendEvent({
      event: 'SEARCH',
      sendWithToken: true,
      data: {
        code: this.props.code,
        // value: filteredCodes,
        value: json,
      },
    });
  };

  modifiedTableColumns = () => {
    /* make all the columns searchable  this is used for searching oneach column */
    const addFilterMethodsToColumn = () => {
      const { columns } = this.props;

      if ( columns.length < 1 ) return null;
      const modifiedCells = columns.map( column => {
        return ({
          ...column,
          ...{ filterMethod: ( filter, rows ) => this.utilMethod( filter, rows, column ) },
          ...{ filterAll: true },
        });
      });

      return modifiedCells;
    };

    const renderCell = ( cellInfo, data ) => {
      const { renderWrapper, cellContext, isSelectable } = this.props;
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
      const cellData = this.props.data[cellInfo.index][cellInfo.column.id];
      const rowData = this.props.data[cellInfo.index];

      if ( renderWrapper ) {
        return (
          <Recursive
            {...renderWrapper}
            context={{
              ...cellContext,
              celld: rowData,
              cellData,
              rowData,
              onPress: isSelectable
                ? () => this.handleSelect( rowData )
                : null,
            }}
          >
            {cellData}
          </Recursive>
        );
      }

      if ( isSelectable ) {
        return (
          <Touchable
            withFeedback
            onPress={() => this.handleSelect( rowData )}
          >
            <Text
              text={cellData}
            />
          </Touchable>
        );
      }

      return cellData;
    };

    return addFilterMethodsToColumn().map(
      data => ({ ...data, Cell: cellInfo => renderCell( cellInfo, data ) })
    );
  }

  handleSelect = ( item ) => {
    if ( item.code ) {
      if ( this.state.selectedItem === item.code ) {
        this.setState({ selectedItem: null });
      }
      else {
        this.setState({ selectedItem: item.code });
      }
    }
  }

  handlePreviousPress = () => {
    if ( this.state.currentPage > 0 ) {
      this.setState( state => ({
        currentPage: state.currentPage - 1,
      }));
    }
  }
  
  handleNextPress = () => {
    /* if we are already loading the next page, we do nothing */
    if ( this.state.isLoadingNextPage ) return;

    /* we check if we are going to a page we currently don't have */
    if ( this.state.currentPage + 1 >= this.state.totalPages ) {
      const value = {
        pageSize: this.props.itemsPerPage,
        pageIndex: this.state.currentPage,
      };
  
      const valueString = (
        value &&
        typeof value === 'string'
      )
        ? value
        : JSON.stringify( value );
        
      /* we ask backend for data */
      Bridge.sendEvent({
        event: 'PAGINATION',
        sendWithToken: true,
        data: {
          code: this.props.code || null,
          value: valueString || null,
        },
      });
      
      /* we show the loading indicator */
      this.setState({
        isLoadingNextPage: true,
      });

      /* after 5 seconds, we jump to the next page */
      setTimeout(() => {
        this.setState( state => ({
          currentPage: state.currentPage + 1,
          totalPages: state.totalPages + 1,
          isLoadingNextPage: false,
        }));
      }, 3000 );
    }
    else {
      this.setState( state => ({
        currentPage: state.currentPage + 1,
      }));
    }
  }

  selectFirstItem() {
    const { data, itemToSelectFirst } = this.props;

    if ( isArray( data, { ofMinLength: 1 })) {
      const isItemInData = ( item ) => {
        if ( !isObject( item )) return false;

        return data.filter( row => row.code === item.code ) > 0;
      };

      const item = isItemInData( itemToSelectFirst ) ? itemToSelectFirst : data[0];

      this.handleSelect( item );
      this.setState({ selectedFirstItemOnMount: true });
    }
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
      isSelectable,
    } = this.props;

    const { selectedItem, currentPage, isLoadingNextPage } = this.state;

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

        {isArray( data ) ? (
          <ReactTable
            page={currentPage}
            className="react-tbl table -striped -highlight"
            style={[tableStyleProps]}
            noDataText="No data to Display."
            filterable={filterable}
            data={data}
            showPageSizeOptions={false}
            columns={this.modifiedTableColumns()}
            pageSize={itemsPerPage}
            showPagination
            PreviousComponent={( props ) => (
              <Touchable
                withFeedback
                onPress={this.handlePreviousPress}
              >
                <Text
                  {...props}
                  text="Previous"
                />
              </Touchable>
            )}
            NextComponent={( props ) => (
              <Touchable
                withFeedback
                onPress={this.handleNextPress}
              >
                <Text
                  {...props}
                  text={isLoadingNextPage ? 'Loading...' : 'Next'}
                />
              </Touchable>
            )}
            getTrProps={( state, rowInfo ) => {
              if ( !rowInfo || !isSelectable ) return {};

              return {
                style: {
                  background: selectedItem === dlv( rowInfo, 'original.code' ) ? '#fffbd7' : '',
                },
              };
            }}
            getTdProps={( state, rowInfo ) => {
              if ( !rowInfo || !isSelectable ) return {};

              return {
                style: {
                  background: selectedItem === dlv( rowInfo, 'original.code' ) ? 'none' : '',
                },
              };
            }}
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
