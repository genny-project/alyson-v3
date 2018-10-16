import React, { Component } from 'react';
import { func, any, string } from 'prop-types';
import prettierBytes from 'prettier-bytes';
import { Box, Text, Icon, Image, Touchable } from '../../../../components';

class InputFileItem extends Component {
  static defaultProps = {
    testID: 'input-file-item',
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
    testID: string,
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
      testID,
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
        testID={testID}
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
