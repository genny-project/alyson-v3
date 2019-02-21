import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Html from 'slate-html-serializer';

import { isKeyHotkey } from 'is-hotkey';
import { string, oneOfType, number, func, object } from 'prop-types';
/* This could be dynamic in the future (pre filled schemas while typing in the job description.) */
import defaultSchema from './defaultSchema.json';
import Toolbar from './ToolBar';
import { Icon } from '../../../components';
import IconWrapperButton from './Button';
import rules from './rules';

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules });

/* default html node to choose */
const DEFAULT_NODE = 'paragraph';

/* check for the hot keys */
/* keyboard shortcuts for example trigger -> make bold when user pressed cmd +B */
const isBoldHotkey = isKeyHotkey( 'mod+b' );
const isItalicHotkey = isKeyHotkey( 'mod+i' );
const isUnderlinedHotkey = isKeyHotkey( 'mod+u' );
const isCodeHotkey = isKeyHotkey( 'mod+`' );

class RichTextEditor extends Component {
  static defaultProps = {
    backgroundColor: '#eee',
    editorBackgroundColor: '#fff',
    height: 'auto',
    width: '100%',
    defaultValue: Value.fromJSON( defaultSchema ),
  }

  static propTypes = {
    onChangeValue: func,
    backgroundColor: string,
    editorBackgroundColor: string,
    height: oneOfType( [string, number] ),
    width: oneOfType( [string,number] ),
    defaultValue: object,
    value: string,

  }

  /* Set initial form value from the JSON file */
  state = {
    value: this.props.defaultValue,
    isValueFromProps: true,
    hasUserTyped: false,
    didUpdateValueFromProps: false,
  };

  // store reloads multips times - to accomodate slight delay we need to perform this
  componentDidUpdate() {
    if ( this.state.isValueFromProps ) {
      if ( !this.state.didUpdateValueFromProps ) {
        if ( this.props.value ) {
          const deserializedValue = Value.fromJS( html.deserialize( this.props.value ));
    
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            isValueFromProps: true,
            value: deserializedValue,
            didUpdateValueFromProps: true,
          });
        }
        else {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            isValueFromProps: true,
            value: this.props.defaultValue,
            didUpdateValueFromProps: true,
          });
        }
      }

      return;
    }

    if (
      !this.state.hasUserTyped &&
      !this.state.isValueFromProps &&
      this.props.value !== this.state.value
    ) {
      if ( this.props.value ) {
        const deserializedValue = Value.fromJS( html.deserialize( this.props.value ));

      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isValueFromProps: true,
          value: deserializedValue,
        });
      }
      else {
      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isValueFromProps: true,
          value: this.props.defaultValue,
        });
      }
    }

    return;
  }

  updateStateFromProps= ( newValue ) => {
    this.setState({ value: newValue });
  }

  hasMark = type => {
    const { value } = this.state;

    return value.activeMarks.some( mark => mark.type === type );
  };

  hasBlock = type => {
    const { value } = this.state;

    return value.blocks.some( node => node.type === type );
  };

  onClickMark = ( event, type ) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark( type );

    this.handleChange( change );
  };

  onClickBlock = ( event, type ) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    // Handle everything but list buttons.
    if ( type !== 'bulleted-list' && type !== 'numbered-list' ) {
      const isActive = this.hasBlock( type );
      const isList = this.hasBlock( 'list-item' );

      if ( isList ) {
        change
          .setBlocks( isActive ? DEFAULT_NODE : type )
          .unwrapBlock( 'bulleted-list' )
          .unwrapBlock( 'numbered-list' );
      } else {
        change.setBlocks( isActive ? DEFAULT_NODE : type );
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock( 'list-item' );
      const isType = value.blocks.some( block => {
        return !!document.getClosest( block.key, parent => parent.type === type );
      });

      if ( isList && isType ) {
        change
          .setBlocks( DEFAULT_NODE )
          .unwrapBlock( 'bulleted-list' )
          .unwrapBlock( 'numbered-list' );
      } else if ( isList ) {
        change
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock( type );
      } else {
        change.setBlocks( 'list-item' ).wrapBlock( type );
      }
    }
    this.handleChange( change );
  };

  handleChange = ({ value }) => {
    const string = html.serialize( value );

    if ( this.state.isValueFromProps === false ) {
      this.props.onChangeValue( string );
    }
    
    this.setState({
      value: value,
      hasUserTyped: true,
    });
  };

  handleKeyDown = ( event, change ) => {
    if ( this.state.isValueFromProps ) {
      this.setState({
        isValueFromProps: false,
      });
    }
    let mark;

    if ( isBoldHotkey( event )) {
      mark = 'bold';
    } else if ( isItalicHotkey( event )) {
      mark = 'italic';
    } else if ( isUnderlinedHotkey( event )) {
      mark = 'underlined';
    } else if ( isCodeHotkey( event )) {
      mark = 'code';
    } else {
      return;
    }
    event.preventDefault();
    change.toggleMark( mark );

    return true;
  };

  renderMarkButton = ( type, icon ) => {
    const isActive = this.hasMark( type );

    return (
      <IconWrapperButton
        active={isActive}
        onMouseDown={event => this.onClickMark( event, type )}
      >
        <Icon
          name={icon}
          color={`${isActive ? 'black' : 'rgb(204,204,204)'}`}
        />
      </IconWrapperButton>
    );
  };

  renderBlockButton = ( type, icon ) => {
    let isActive = this.hasBlock( type );

    if ( ['numbered-list', 'bulleted-list'].includes( type )) {
      const { value } = this.state;
      const parent = value.document.getParent( value.blocks.first().key );

      isActive = this.hasBlock( 'list-item' ) && parent && parent.type === type;
    }

    return (
      <IconWrapperButton
        active={isActive}
        onMouseDown={event => this.onClickBlock( event, type )}
      >
        <Icon
          name={icon}
          color={`${isActive ? 'black' : 'rgb(204,204,204)'}`}
        />
      </IconWrapperButton>
    );
  };

  renderNode = props => {
    const { attributes, children, node } = props;

    /* render the html node based on user choice in the editor */
    switch ( node.type ) {
      case 'block-quote':
        return (
          <blockquote {...attributes}>
            {children}
          </blockquote>
        );
      case 'code':
        return (
          <pre {...attributes}>
            {children}
          </pre>
        );
      case 'paragraph':
        return (
          <p {...attributes}>
            {children}
          </p>
        );
      case 'bulleted-list':
        return (
          <ul {...attributes}>
            {children}
          </ul>
        );
      case 'heading-one':
        return (
          <h1 {...attributes}>
            {children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 {...attributes}>
            {children}
          </h2>
        );
      case 'list-item':
        return (
          <li {...attributes}>
            {children}
          </li>
        );
      case 'numbered-list':
        return (
          <ol {...attributes}>
            {children}
          </ol>
        );
      default:
        return (
          <p {...attributes}>
            {children}
          </p>
        );
    }
  };

  renderMark = props => {
    const { children, mark, attributes } = props;

    switch ( mark.type ) {
      case 'bold':
        return (
          <strong {...attributes}>
            {children}
          </strong>
        );
      case 'code':
        return (
          <code {...attributes}>
            {children}
          </code>
        );
      case 'italic':
        return (
          <em {...attributes}>
            {children}
          </em>
        );
      case 'underlined':
        return (
          <u {...attributes}>
            {children}
          </u>
        );
      case 'paragraph':
        return (
          <span {...attributes}>
            {children}
          </span>
        );
    }
  };

  render() {
    const { backgroundColor, width, height, editorBackgroundColor } = this.props;

    return (
      <div
        style={{
          backgroundColor: backgroundColor,
          width: width,
          padding: 20,
          fontFamily: 'Helvetica',
          height: height }}
      >
        <Toolbar>
          {this.renderMarkButton( 'bold', 'format_bold' )}
          {this.renderMarkButton( 'italic', 'format_italic' )}
          {this.renderMarkButton( 'underlined', 'format_underlined' )}
          {this.renderMarkButton( 'code', 'code' )}
          {this.renderMarkButton( 'paragraph', 'text_format' )}
          {this.renderBlockButton( 'heading-one', 'looks_one' )}
          {this.renderBlockButton( 'heading-two', 'looks_two' )}
          {this.renderBlockButton( 'block-quote', 'format_quote' )}
          {this.renderBlockButton( 'numbered-list', 'format_list_numbered' )}
          {this.renderBlockButton( 'bulleted-list', 'format_list_bulleted' )}
        </Toolbar>
        <Editor
          backgroundColor={editorBackgroundColor}
          style={
            { backgroundColor: 'white',
              height: 400, margin: 0,
              padding: 10,
            }
            }
          autoFocus
          placeholder=""
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    );
  }
}

export default RichTextEditor;
