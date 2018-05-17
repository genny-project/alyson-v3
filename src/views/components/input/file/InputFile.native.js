import React, { Component } from 'react';
import axios from 'axios';
import Expo, { ImagePicker, DocumentPicker } from 'expo';
import { bool } from 'prop-types';
import dlv from 'dlv';
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

  uploadImage = result => {
    // console.log( 'upload' ) ;
    // console.log( result );

    const localUri = result.uri;
    const filename = localUri.split( '/' ).pop();
  
    // Infer the type of the image
    const match = /\.(\w+)$/.exec( filename );
    const type = match ? `image/${match[1]}` : 'image';
  
    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "photo" is the name of the form field the server expects

    // console.log( formData );

    axios({
      method: 'get',
      url: `https://uppych40.channel40.com.au/s3/params?filename=${filename}&type=${type.split( '/' )[0]}%2F${type.split( '/' )[1]}`,
    })
    .then( response => {
      // console.log( response );
      
      if ( response.status === 200 ) {
        if ( dlv( response, 'data.fields' )) {
          const fields = response.data.fields;
          
          Object.keys( fields ).forEach( field_key => {
            formData.append( field_key, fields[field_key] );
          });

          formData.append( 'file', { uri: localUri, name: filename, type });
          
          // console.log( formData );

          fetch( response.data.url, {
            method: 'POST',
            body: formData,
            header: {
              'content-type': 'multipart/form-data',
            },
          });
          // .then( async response => {
          //   // const text = await response.text();

          //   // console.log( text );
          // });
        }
      }
    });
  }

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
          this.uploadImage( result );
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
