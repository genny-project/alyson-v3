import React, { Component } from 'react';
import { connect } from 'react-redux';

class Payments extends Component {
  render() {
    return (
      <div>
        TODO Payments
      </div>
    );
  }
}

const mapStateToProps = state => ({
  aliases: state.vertx.aliases,
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( Payments );
