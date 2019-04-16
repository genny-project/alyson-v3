import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';

import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { func, string, object } from 'prop-types';
import style from './style.css'; //eslint-disable-line

class RichEditorExample extends Component {
  static propTypes = {
    onChangeValue: func,
    onToggle: func,
    value: string,
    style: object,
    editorState: object,
  };

  constructor( props ) {
    super( props );
    this.editor = React.createRef();
    this.state = { editorState: EditorState.createEmpty() };
    this.handleFocus = () => this.editor.current.focus();
    this.handleChange = editorState => this.setState({ editorState });
    this.onKeyCommand = this._handleKeyCommand.bind( this );
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind( this );
    this.handleToggleBlockType = this._toggleBlockType.bind( this );
    this.handleToggleInlineStyle = this._toggleInlineStyle.bind( this );
    this.handleBlur = this.handleBlur.bind( this );
  }

  componentDidUpdate( prevprops ) {
    if ( this.props.value !== prevprops.value ) {
      const getStateFromHTML = stateFromHTML( this.props.value );

      // eslint-disable-next-line
      this.setState({
        editorState: EditorState.createWithContent( getStateFromHTML ),
      });
    }
  }

  _handleKeyCommand( command, editorState ) {
    const newState = RichUtils.handleKeyCommand( editorState, command );

    if ( newState ) {
      this.handleChange( newState );

      return true;
    }

    return false;
  }

  _mapKeyToEditorCommand( e ) {
    if ( e.keyCode === 9 /* TAB */ ) {
      const newEditorState = RichUtils.onTab( e, this.state.editorState, 4 /* maxDepth */ );

      if ( newEditorState !== this.state.editorState ) {
        this.handleChange( newEditorState );
      }

      return;
    }

    return getDefaultKeyBinding( e );
  }

  _toggleBlockType( blockType ) {
    this.handleChange( RichUtils.toggleBlockType( this.state.editorState, blockType ));
  }

  _toggleInlineStyle( inlineStyle ) {
    this.handleChange( RichUtils.toggleInlineStyle( this.state.editorState, inlineStyle ));
  }

  handleBlur() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    const htmlOutput = stateToHTML( contentState );

    // when data changes we send the value to the backend as an html
    this.props.onChangeValue( htmlOutput );
  }

  render() {
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();

    if ( !contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.handleToggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.handleToggleInlineStyle}
        />
        <div
          className={className}
          onClick={this.handleFocus}
        >
          <Editor
            onBlur={this.handleBlur}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.onKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.handleChange}
            placeholder=" "
            ref={this.editor}
            spellCheck
          />
        </div>
      </div>
    );
  }
}
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle( block ) {
  switch ( block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}
// eslint-disable-next-line
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle( this.props.style );
    };
  }

  render() {
    let className = 'RichEditor-styleButton';

    if ( this.props.active ) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span
        className={className}
        onMouseDown={this.onToggle}
      >
        {this.props.label}
      </span>
    );
  }
}
const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey( selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map( type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map( type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has( type.style )}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default RichEditorExample;
