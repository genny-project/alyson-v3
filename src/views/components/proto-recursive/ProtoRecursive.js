/* eslint-disable */

import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { connect } from 'react-redux';
import { Fragment, ProtoLayout } from '../index';
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
    const { data, attributes, layouts } = this.props;

    if ( !isArray( layouts, { ofMinLength: 1 })) {
      return null;
    }

    return (
      <Fragment>
        {layouts.map( x => {
          return (
            <ProtoLayout
              key={x}
              rootCode={x}
            />
          );
        })}
      </Fragment>

    );
  }
}

export default ProtoRecursive;
