/* eslint-disable */

import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { connect } from 'react-redux';
import { Fragment, ProtoLayout, Text } from '../index';
import { isArray, isString, isObject } from '../../../utils';

class ProtoRecursive extends Component {
  static propTypes = {
    data: object,
    attributes: object,
    layouts: array,
  }

  state = {
  }

  render() {
    const { data, attributes, layouts, themes } = this.props;

    if ( !isArray( layouts, { ofMinLength: 1 })) {
      return null;
    }

    // console.log( layouts );

    return (
      <Fragment>
        {layouts.map( x => {
          const baseEntityCode = x.code;
          const linkType = x.type;

          if ( linkType === 'ask' ) {
            return (
              <Text
                key={baseEntityCode}
                text={baseEntityCode}
              />
            );
          }

          return (
            <ProtoLayout
              key={baseEntityCode}
              rootCode={baseEntityCode}
              inheritedThemes={themes}
            />
          );
        })}
      </Fragment>

    );
  }
}

export default ProtoRecursive;
