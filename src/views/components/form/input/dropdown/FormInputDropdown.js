import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { Input } from '../../../index';

class FormInputDropdown extends Component {
  static propTypes = {
    question: object,
    baseEntities: object,
  }

  state = {
    items: [],
  }

  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( prevState.items.length === 0 )
      this.getItems();
  }

  getItems() {
    const { data, links } = this.props.baseEntities;
    const { validationList } = this.props.question.attribute.dataType;
    const items = [];

    if (
      validationList &&
      validationList instanceof Array &&
      validationList.length > 0
    ) {
      validationList.forEach( validation => {
        if (
          validation.selectionBaseEntityGroupList &&
          validation.selectionBaseEntityGroupList instanceof Array &&
          validation.selectionBaseEntityGroupList.length > 0
        ) {
          validation.selectionBaseEntityGroupList.forEach( baseEntity => {
            const linkGroup = links[baseEntity];

            if (
              linkGroup &&
              linkGroup.links &&
              linkGroup.links instanceof Array &&
              linkGroup.links.length > 0
            ) {
              linkGroup.links.forEach( link => {
                const linkData = data[link];

                if (
                  linkData &&
                  linkData.name
                ) {
                  items.push( linkData.name );
                }
              });
            }
          });
        }
      });
    }

    if ( items.length > 0 )
      this.setState({ items });
  }

  render() {
    const { ...restProps } = this.props;
    const { items } = this.state;

    return (
      <Input
        {...restProps}
        items={items}
      />
    );
  }
}

export { FormInputDropdown };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( FormInputDropdown );
