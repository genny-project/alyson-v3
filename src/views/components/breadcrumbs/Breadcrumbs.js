import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { Box, Text, Fragment, Icon } from '../index';
import { isArray, isString, isObject } from '../../../utils';

class Breadcrumbs extends Component {
  static propTypes = {
    location: object,
    pages: object,
  }

  state = {
    items: [],
  }

  // start with location.path
  // split on '/'s
  // create a new string for each split, including all the previous items
  // for each string, dlv pages and see if there is a matching layout.
  // if yes, find the title and add to the array

  componentDidMount() {
    if ( isString( this.props.location.pathname )) {
      this.parseLocation( this.props.location.pathname );
    }
  }

  componentDidUpdate( prevProps ) {
    if (
      isString( this.props.location.pathname ) &&
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.parseLocation( this.props.location.pathname );
    }
  }

  parseLocation = ( path ) => {
    const split = path.split( '/' );
    const items = [];
    const paths = [];
    const formattedItems = [];

    split.forEach( section => {
      if ( isString( section, { ofMinLength: 1 })) {
        items.push( section );
      }
    });

    items.forEach(( item, index ) => {
      const path = items.slice( 0, index + 1 );

      paths.push( path.join( '/' ));
    });

    paths.forEach( path => {
      const page = this.checkPagesForMatch( path );

      if (
        isObject( page, { withProperty: 'layout' })
      ) {
        formattedItems.push({
          path: path,
          title: page.layout.title,
        });
      }
    });

   // TODO if home isnt in items, add home to start of routes

    this.setState({
      items: formattedItems,
    });
  }

  checkPagesForMatch = ( path ) => {
    const { pages } = this.props;
    let page = null;

    page = pages[path];

    if ( page ) return page;

    // get path for each page with a variable
    const pagesWithVariables = Object.keys( pages ).filter( page => page.includes( ':' ));

    // find the index of the variable after splitting
    pagesWithVariables.forEach( pageWithVariablePath => {
      const pageWithVariablePathSplit = pageWithVariablePath.split( '/' );
      const variableIndex = pageWithVariablePathSplit.findIndex( x => x.includes( ':' ));

      if ( variableIndex > 0 ) {
        // get the corresponding code from the same split index from the current path
        const pathSplit = path.split( '/' );

        if ( pathSplit.length === pageWithVariablePathSplit.length ) {
          const pathWithVariableRemoved = pathSplit
            .filter(( string, index ) => index !== variableIndex );
          const pageWithVariablePathWithVariableRemoved = pageWithVariablePathSplit
            .filter(( string, index ) => index !== variableIndex );

          // check all other splits and see if they match
          const isMatch = pathWithVariableRemoved
            .every(( stringA, index ) =>
              stringA === pageWithVariablePathWithVariableRemoved[index] );

          if ( isMatch ) page = pages[pageWithVariablePath];
        }
      }
    });

    if ( page ) return page;
  }

  render() {
    const { items } = this.state;

    return (
      <Box
        flexDirection="row"
        alignItems="center"
      >
        {
          isArray( items )
            ? (
              items.map(( item, index ) => {
                return (
                  <Fragment key={item.path}>
                    <TouchableOpacity>
                      <Box>
                        <Text text={item.title} />
                      </Box>
                    </TouchableOpacity>
                    {
                      index + 1 < items.length
                        ? (
                          <Icon
                            size="sm"
                            color="white"
                            name="keyboard_arrow_right"
                          />
                        )
                        : null
                    }
                  </Fragment>
                );
              })
            )
            : <Text text="no items" />
        }
      </Box>
    );
  }
}

export { Breadcrumbs };

const mapStateToProps = state => ({
  location: state.router.location,
  pages: state.vertx.layouts.pages,
});

export default connect( mapStateToProps )( Breadcrumbs );
