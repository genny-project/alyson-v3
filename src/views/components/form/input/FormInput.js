import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import { Input } from '../../index';

class FormInput extends Component {
  static propTypes = {
    type: string.isRequired,
    question: object,
    onChangeValue: func.isRequired,
  }

  handleChangeValueWithSend = value => {
    this.props.onChangeValue( value, true );
  }

  render() {
    const { type, question } = this.props;

    switch ( type ) {
      case 'termsandconditions':
        return (
          <Input
            {...this.props}
            html={question.html}
            onChangeValue={this.handleChangeValueWithSend}
          />
        );

      default:
        return <Input {...this.props} />;
    }
  }
}

export default FormInput;
