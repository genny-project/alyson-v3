import React, { Component } from 'react';
// import axios from 'axios';
import Expo, { ImagePicker, DocumentPicker } from 'expo';
import { bool } from 'prop-types';
import { Box } from '../../../components';
import InputFileItem from './file-item';
import InputFileTouchable from './file-touchable';

class InputFile extends Component {
  static defaultProps = {
    imageOnly: false,
  }

  static propTypes = {
    imageOnly: bool,
  }
  
  state = {
    files: [],
  };

  // uploadImage = () => {
  //   axios.post({
  //     method: 'post',
  //     url: 'https://s3.ap-southeast-2.amazonaws.com/channel40-images',
  //     data: {
  //       firstName: 'Fred',
  //       lastName: 'Flintstone',
  //     },
  //   })
  //   .then(( response ) => {
  //     // console.log( response );
  //   })
  //   .catch(( error ) => {
  //     // console.log( error );
  //   });
  // }

  handlePress = async () => {
    const { imageOnly } = this.props;
    
    if ( imageOnly ) {
      await Expo.Permissions.askAsync( Expo.Permissions.CAMERA_ROLL );
      await Expo.Permissions.askAsync( Expo.Permissions.CAMERA );
      // Expo.ImagePicker.launchCameraAsync(options)
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });

        if ( !result.cancelled ) {
          result['id'] = result.uri;
          this.uploadImage();
          this.setState( state => ({
            files: [
              ...state.files,
              result,
            ],
          }));
        }
      }
      catch ( e ) {
        // do nothing
      }
    }
    else {
      try {
        const result = await DocumentPicker.getDocumentAsync(
        
        );

        if ( result.type !== 'cancel' ) {
          result['id'] = result.uri;
          this.uploadImage();
          this.setState( state => ({
            files: [
              ...state.files,
              result,
            ],
          }));
        }
      }
      catch ( e ) {
        // do nothing
      }
    }
  }

  handleRemoveFile = fileId => () => {
    this.setState( state => ({
      files: state.files.filter(({ id }) => id !== fileId ),
    }), () => {
    });
  }

  render() {
    const { imageOnly } = this.props;
    const { files } = this.state;

    return (
      <Box
        width="100%"
        flexDirection="column"
      >
        {
          files &&
          files.length > 0 &&
            ( files.map( file => {
              return (
                <InputFileItem
                  key={file.uri}
                  id={file.uri}
                  size={file.size}
                  name={file.name}
                  // uploaded={file.uploaded}
                  type={file.type}
                  preview={file.uri}
                  uploadURL={file.uri}
                  // uploadURL={file.uploadURL}
                  onRemove={this.handleRemoveFile}
                />
              );
            })
            )
        }
        <InputFileTouchable
          onPress={this.handlePress}
          text={
            `Pick a${
              imageOnly 
                ? 'n image from camera roll'
                : ' file from your device'
            }`
          }
        />
      </Box>
    );
  }
}

export default InputFile;
