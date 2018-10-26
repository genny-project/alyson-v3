import React, { Component } from 'react';
import { object, string, bool, oneOf, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dlv from 'dlv';
import { isArray, isString, Bridge } from '../../../utils';
import { closeSidebar, toggleSidebar } from '../../../redux/actions';
import SidebarBody from './body';

class Sidebar extends Component {
  static defaultProps = {
    getItemDataFromStore: false,
    rootCode: 'GRP_ROOT',
    side: 'left',
  }

  static propTypes = {
    baseEntities: object,
    aliases: object,
    layout: object,
    rootCode: string,
    getItemDataFromStore: bool,
    side: oneOf( ['left', 'right'] ),
    closeSidebar: func,
    toggleSidebar: func,
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
              code: targetCode,
              items: linkedBaseEntities,
              isDropdown: true,
            });

            return items;
          }
        }

        items.push({
          icon,
          name: baseEntityName,
          code: targetCode,
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

  handleToggle = () => {
    // console.warn( this.props.side, this.props );
    this.props.toggleSidebar( this.props.side );
  }

  handleClose = () => {
    this.props.closeSidebar( this.props.side );
  }

  render() {
    const { rootCode, side, layout, ...restProps } = this.props;

    const root = (
      side === 'left' ? (
        layout.sidebarProps &&
        layout.sidebarProps.rootCode
          ? layout.sidebarProps.rootCode
          : rootCode
      ) : (
        layout.sidebarRightProps &&
        layout.sidebarRightProps.rootCode
          ? layout.sidebarRightProps.rootCode
          : rootCode
      )
    );

    const items = this.getLinkedBaseEntities( root, true );
    const logo = this.getSidebarImage();

    return (
      <SidebarBody
        {...restProps}
        {...side === 'left'
          ? layout.sidebarProps
          : layout.sidebarRightProps}
        layout={layout}
        items={items}
        headerImage={logo}
        side={side}
        onClose={this.handleClose}
        onToggle={this.handleToggle}
      />
    );
  }
}

export { Sidebar };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  aliases: state.vertx.aliases,
  layout: state.layout,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar, toggleSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
