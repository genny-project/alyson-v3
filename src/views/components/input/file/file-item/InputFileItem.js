import React, { Component } from 'react';
import { func, any } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import prettierBytes from 'prettier-bytes';
import { Box, Text, Icon, Image } from '../../../../components';

class InputFileItem extends Component {
  static defaultProps = {
  }

  static propTypes = {
    id: any,
    size: any,
    name: any,
    uploaded: any,
    type: any,
    preview: any,
    uploadURL: any,
    error: any,
    onRemove: func,
  }

  state = {
  }

  render() {
    const {
      id,
      size,
      name,
      uploaded,
      type,
      preview,
      uploadURL,
      error,
      onRemove,
    } = this.props;
    
    return (
      <Box
        key={id}
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        padding={10}
      >
        {
          ( 
            type.includes( 'image' ) && ( !!preview || !!uploadURL )
          ) ? (
            <Image
              source={uploadURL || preview}
              width={40}
              height={40}
              shape="circle"
            />
            ) : (
              <Box>
                <Icon
                  name={(
                    type &&
                    type.includes( 'image' )
                      ? 'image'
                      : type.includes( 'video' )
                        ? 'videocam'
                        : type.includes( 'audio' )
                          ? 'audiotrack'
                          : type.includes( 'pdf' )
                            ? 'picture-as-pdf'
                            : 'insert-drive-file'
                  )}
                  color="grey"
                />
              </Box>
            )
        }
        <Box
          flexDirection="column"
          alignItems="flex-start"
          paddingX={10}
        >
          <Text
            // href={file.uploadURL}
            target="_blank"
            rel="noopener"
            size="sm"
          >
            {name}
            {uploaded
              ? ' (uploaded)'
              : ' (not uploaded)'}
            {error && '(ERROR)'}
          </Text>
          <Text
            size="xxs"
            color="black"
          >
            {
              size
                ? prettierBytes( size )
                : 'size unknown'
            }
          </Text>
        </Box>
        <Box
          marginLeft="auto"
        >
          <TouchableOpacity
            onPress={onRemove( id )}
          >
            <Icon
              name="close"
              color="grey"
            />
          </TouchableOpacity>
        </Box>
      </Box>
    );
  }
}

export default InputFileItem;
