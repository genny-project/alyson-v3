import React, { Component } from 'react';
import { func, any } from 'prop-types';
import prettierBytes from 'prettier-bytes';
import { Box, Text, Icon, Image, Touchable } from '../../../../components';

class InputFileItem extends Component {
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

  getIconName() {
    const { type } = this.props;

    return (
      type.includes( 'image' ) ? 'image'
      : type.includes( 'video' ) ? 'videocam'
      : type.includes( 'audio' ) ? 'audiotrack'
      : type.includes( 'pdf' ) ? 'picture-as-pdf'
      : 'insert-drive-file'
    );
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

    const hasImagePreview = (
      type.includes( 'image' ) &&
      ( !!preview || !!uploadURL )
    );

    return (
      <Box
        key={id}
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        padding={10}
        paddingBottom={15}
      >
        {hasImagePreview ? (
          <Image
            source={uploadURL || preview}
            width={40}
            height={40}
            shape="circle"
          />
        ) : (
          <Box>
            <Icon
              name={this.getIconName( type )}
              color="grey"
            />
          </Box>
        )}

        <Box
          flexDirection="column"
          alignItems="flex-start"
          paddingX={10}
          flex={1}
        >
          <Text
            // href={file.uploadURL}
            target="_blank"
            rel="noopener"
            size="sm"
            width="100%"
          >
            {name}
            {uploaded
              ? ' (uploaded)'
              : ' (not uploaded)'}
            {error && '(ERROR)'}
          </Text>

          {size ? (
            <Text
              size="xxs"
              color="black"
            >
              {prettierBytes( size )}
            </Text>
          ) : null}
        </Box>

        <Box marginLeft="auto">
          <Touchable
            withFeedback
            onPress={onRemove( id )}
          >
            <Icon
              name="close"
              color="grey"
            />
          </Touchable>
        </Box>
      </Box>
    );
  }
}

export default InputFileItem;
