/* eslint-disable */

import React, { Component } from 'react';
import { object } from 'prop-types';
import queryString from 'query-string';
import { location } from '../../../utils';
import { LayoutLoader, LayoutFetcher, KeycloakConsumer, Redirect, ProtoLayout } from '../../components';

class Generic extends Component {
  static propTypes = {
    keycloak: object,
    layout: object,
  }

  render() {
    return (
      <ProtoLayout rootCode="FRAME_ROOT" />
    );
  }
}

export default Generic;
