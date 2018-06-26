import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dlv from 'dlv';
import { isArray, isString, Bridge } from '../../../utils';
import { closeSidebar } from '../../../redux/actions';
import SidebarBody from './body';

class Sidebar extends Component {
  static propTypes = {
    baseEntities: object,
    aliases: object,
  }

  getLinkedBaseEntities = ( root, isRecursive ) => {
    const { baseEntities } = this.props;
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

      if ( isString( baseEntityName, { ofMinLength: 1 })) {
        const icon = dlv( baseEntities, `attributes.${targetCode}.PRI_IMAGE_URL.valueString` );

        if ( isRecursive ) {
          const linkedBaseEntities = this.getLinkedBaseEntities( targetCode );

          if ( isArray( linkedBaseEntities, { ofMinLength: 1 })) {
            items.push({
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
    const items = this.getLinkedBaseEntities( 'GRP_ROOT', true );
    const logo = this.getSidebarImage();

    return (
      <SidebarBody
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
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
