import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dlv from 'dlv';
import { closeSidebar } from '../../../redux/actions';
import SidebarBody from './body';

class Sidebar extends Component {
  static propTypes = {
    baseEntities: object,
    aliases: object,
  }

  getLinkedBaseEntities = ( bes, root ) => {
    const links = dlv( bes, `data.${root}.links` );

    const arr = [];

    if ( links && links.length > 0 ) {
      links.sort(( x,y ) => x.weight > y.weight ).forEach(( link ) => {
        const weight = link.weight;
        const code = dlv( link, 'link.targetCode' );
        const linkedBe = dlv( bes, `data.${code}` );

        if ( weight !== 0 && ( linkedBe !== null && linkedBe !== undefined )) arr.push( linkedBe );
      });
    }

    return arr.map(( item ) => {
      const linkedBes = this.getLinkedBaseEntities( bes, item.code );

      if ( linkedBes && linkedBes.length > 0 ) {
        return {
          name: item.name,
          isDropdown: true,
          icon: 'home',
          items: linkedBes,
        };
      }

      return {
        name: item.name,
        path: 'home',
        icon: 'home',
      };
    });
  }

  getSidebarImage() {
    const { aliases, baseEntities } = this.props;
    const projectAttributes = baseEntities.attributes[aliases.PROJECT];
    const logo = dlv( projectAttributes, 'PRI_LOGO.valueString' );

    return logo;
  }

  render() {
    const {
      baseEntities,
    } = this.props;

    const items = this.getLinkedBaseEntities( baseEntities, 'GRP_ROOT' );
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
