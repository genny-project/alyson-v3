import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { string, oneOfType, number } from 'prop-types';
/* This could be dynamic in the future (pre filled schemas while typing in the job description.) */
import initialValue from './defaultSchema.json';
import Toolbar from './ToolBar';
import { Icon } from '../../../components';
import IconWrapperButton from './Button';

/* default html node to choose */
const DEFAULT_NODE = 'paragraph';

/* check for the hot keys */
/* keyboard shortcuts for example trigger -> make bold when user pressed cmd +B */
const isBoldHotkey = isKeyHotkey( 'mod+b' );
const isItalicHotkey = isKeyHotkey( 'mod+i' );
const isUnderlinedHotkey = isKeyHotkey( 'mod+u' );
const isCodeHotkey = isKeyHotkey( 'mod+`' );

class RichTextEditor extends React.Component {
  static defaultProps = {
    backgroundColor: '#eee',
    editorBackgroundColor: '#fff',
    height: 'auto',
    width: '100%',
  }
  
  static propTypes = {
    backgroundColor: string,
    editorBackgroundColor: string,
    height: oneOfType( [string, number] ),
    width: oneOfType( [string,number] ),
  }

  /* Set initial form value from the JSON file */
  state = {
    value: Value.fromJSON( initialValue ),
  };

  hasMark = type => {
    const { value } = this.state;

    return value.activeMarks.some( mark => mark.type === type );
  };

  hasBlock = type => {
    const { value } = this.state;

    return value.blocks.some( node => node.type === type );
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

  handleChange = ({ value }) => {
    this.setState({ value });
  };

  handleKeyDown = ( event, change ) => {
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
