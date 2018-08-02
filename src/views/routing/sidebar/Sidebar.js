import React, { Component } from 'react';
import { object, string, bool } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dlv from 'dlv';
import { isArray, isString, Bridge } from '../../../utils';
import { closeSidebar } from '../../../redux/actions';
import SidebarBody from './body';

class Sidebar extends Component {
  static propTypes = {
    getItemDataFromStore: false,
  }

  static propTypes = {
    baseEntities: object,
    aliases: object,
    sidebarRootCode: string,
    sidebarProps: object,
    getItemDataFromStore: bool,
  }

  /*
    getItemDataFromStore prop allows the data of the item
    from the store will be passed down to the render and
    be assessible in a custom sublayout:

    itemBaseEntity: base entity from data field,
    itemAttributes: attributes from attribute field
  */

  getLinkedBaseEntities = ( root, isRecursive ) => {
    const { baseEntities, getItemDataFromStore } = this.props;
    const links = dlv( baseEntities, `data.${root}.links` );

    if ( !isArray( links, { ofMinLength: 1 }))
      return [];

    /* Filter out invalid links and sort by weight. */
    const sortedLinks = (
      links
        .filter( this.handleFilterLinks )
        .sort( this.handleSortLinks )
    );

    /* Convert the array of sorted links into */
    return sortedLinks.reduce(( items, link ) => {
      if ( !link.link )
        return items;

      const { targetCode } = link.link;
      const baseEntityName = dlv( baseEntities, `data.${targetCode}.name` );
      let itemData = {};

      if ( getItemDataFromStore ) {
        itemData = {
          itemBaseEntity: dlv( baseEntities, `data.${targetCode}` ),
          itemAttributes: dlv( baseEntities, `attributes.${targetCode}` ),
        };
      }
      
      if ( isString( baseEntityName, { ofMinLength: 1 })) {
        const icon = dlv( baseEntities, `attributes.${targetCode}.PRI_IMAGE_URL.valueString` );

        if ( isRecursive ) {
          let linkedBaseEntities = this.getLinkedBaseEntities( targetCode );
          
          linkedBaseEntities = linkedBaseEntities.filter( x => x.linkValue === 'LNK_CORE' );
          
          if ( isArray( linkedBaseEntities, { ofMinLength: 1 })) {
            items.push({
              ...itemData,
              icon,
              name: baseEntityName,
              items: linkedBaseEntities,
              isDropdown: true,
            });

            return items;
          }
        }

        items.push({
          icon,
          name: baseEntityName,
          onPress: this.handlePress( link.link ),
        });
      }
      
      return items;
    }, [] );
  }

  getSidebarImage() {
    const { aliases, baseEntities } = this.props;
    const projectAttributes = baseEntities.attributes[aliases.PROJECT];
    const logo = dlv( projectAttributes, 'PRI_LOGO.valueString' );

    return logo;
  }

  handleSortLinks = ( a, b ) => {
    return a.weight > b.weight;
  }

  handleFilterLinks = link => {
    return link.weight !== 0;
  }

  handlePress = ({ sourceCode, targetCode }) => () => {
    Bridge.sendEvent({
      event: 'TV_EVENT',
      eventType: 'TV_SELECT',
      sendWithToken: true,
      data: {
        code: sourceCode,
        value: targetCode,
      },
    });
  }

  render() {
    const { sidebarRootCode, sidebarProps } = this.props;
    const items = this.getLinkedBaseEntities( `${sidebarRootCode || 'GRP_ROOT'}`, true );
    const logo = this.getSidebarImage(); 
    
    return (
      <SidebarBody
        {...sidebarProps}
        items={items}
        headerImage={logo}
      />
    );
  }
}

export { Sidebar };

const mapStateToProps = state => ({
  sidebar: state.sidebar,
  baseEntities: state.vertx.baseEntities,
  aliases: state.vertx.aliases,
  ...state.layout.sidebarProps,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
