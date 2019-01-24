import React from 'react';
// This file consists of rules for serializing and de serializing the values from Rich text editor 

const BLOCK_TAGS = {
  blockquote: 'block-quote',
  p: 'paragraph',
  pre: 'code',
  code: 'code',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  li: 'list-item',
  h3: 'heading-three',
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underlined',
  pre: 'code',
  code: 'code',
};

const rules = [
  {
    deserialize( el, next ) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];

      if ( type ) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute( 'class' ),
          },
          nodes: next( el.childNodes ),
        };
      }
    },
    serialize( obj, children ) {
      if ( obj.object === 'block' ) {
        switch ( obj.type ) {
          case 'code':
            return (
              <pre>
                <code>
                  {children}
                </code>
              </pre>
            );
          case 'paragraph':
            return (
              <p className={obj.data.get( 'className' )}>
                {children}
              </p>
            );
          case 'bulleted-list':
            return (
              <ul>
                {children}
              </ul>
            );
          case 'heading-one':
            return (
              <h1>
                {children}
              </h1>
            );
          case 'heading-two':
            return (
              <h2>
                {children}
              </h2>
            );
          case 'list-item':
            return (
              <li>
                {children}
              </li>
            );
          case 'numbered-list':
            return (
              <ol>
                {children}
              </ol>
            );
        
          default:
            return (
              <p> 
                {children}
              </p>
            );
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize( el, next ) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];

      if ( type ) {
        return {
          object: 'mark',
          type: type,
          nodes: next( el.childNodes ),
        };
      }
    },
    serialize( obj, children ) {
      if ( obj.object === 'mark' ) {
        switch ( obj.type ) {
          case 'bold':
            return (
              <strong>
                {children}
              </strong>
            );
          case 'italic':
            return (
              <em>
                {children}
              </em>
            );
          case 'underlined':
            return (
              <u>
                {children}
              </u>
            );
          case 'code':
            return (
              <pre>
                <code>
                  {children}
                </code>
              </pre>
            );
          case 'paragraph':
            return (
              <p className={obj.data.get( 'className' )}>
                {children}
              </p>
            );
          case 'block-quote':
            return (
              <blockquote>
                {children}
              </blockquote>
            );
          default:
            return (
              <span> 
                {children}
              </span>
            );
        }
      }
    },
  },
];

export default rules;
