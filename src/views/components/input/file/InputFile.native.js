import React, { Component } from 'react';
import axios from 'axios';
import Expo, { ImagePicker, DocumentPicker } from 'expo';
import { bool, func } from 'prop-types';
import dlv from 'dlv';
import fastXmlParser from 'fast-xml-parser';
import mime from 'react-native-mime-types';
import { Box } from '../../../components';
import InputFileItem from './file-item';
import InputFileTouchable from './file-touchable';

class InputFile extends Component {
  static defaultProps = {
    imageOnly: false,
  }

  static propTypes = {
    imageOnly: bool,
    onChange: func,
  }
  
  state = {
    files: [],
  };

  handleComplete = result => {
    this.setState( prevState => ({
      files: [
        ...prevState.files,
        result,
      ],
    }), () => {
      this.handleSaveToServer;
    });
  }

  handleSaveToServer = () => {
    const { files } = this.state;
    
    if ( this.props.onChange ) {
      this.props.onChange({ target: { value: files } });
    }
  }

  uploadFile = result => {
    const localUri = result.uri;
    const filename = localUri.split( '/' ).pop();
    const match = /\.(\w+)$/.exec( filename );

    const type = match ? mime.contentType( match[1] ).split( ';' )[0] : 'file';  
    const formData = new FormData();
    const url = 'https://uppych40.channel40.com.au/s3/';
    
    axios({
      method: 'get',
      url: `${url}params?filename=${filename}&type=${type.split( '/' )[0]}%2F${type.split( '/' )[1]}`,
    })
    .then( response => {
      if ( response.status === 200 ) {
        if ( dlv( response, 'data.fields' )) {
          const data = response.data;
          const fields = response.data.fields;
          
          Object.keys( fields ).forEach( field_key => {
            formData.append( field_key, fields[field_key] );
          });

          formData.append( 'file', { uri: localUri, name: filename, type });
          
          fetch( response.data.url, {
            method: 'POST',
            body: formData,
            header: {
              'content-type': 'multipart/form-data',
            },
          })
          .then( async response => {
            const text = await response.text();

            const jsonObj = fastXmlParser.parse( text );
            
            const formattedFile = {
              data: {
                name: formData._parts.filter( field => ( field[0] === 'file' ))[0][1].name,
                // size: 65240,
                type: formData._parts.filter( field => ( field[0] === 'file' ))[0][1].type,
              },
              extension: type.split( '/' )[1],
              id: dlv( jsonObj, 'PostResponse.Key' ),
              meta: {
                ...fields,
                name: formData._parts.filter( field => ( field[0] === 'file' ))[0][1].name,
                type: formData._parts.filter( field => ( field[0] === 'file' ))[0][1].type,
              },
              name: formData._parts.filter( field => ( field[0] === 'file' ))[0][1].name,
              response: {
                body: jsonObj.PostResponse,
                status: fields.success_action_status,
                uploadURL: dlv( jsonObj, 'PostResponse.Location' ),
              },
              // size: ,
              type: formData._parts.filter( field => ( field[0] === 'file' ))[0][1].type,
              uploadURL: dlv( jsonObj, 'PostResponse.Location' ),
              uploaded: true,
              xhrUpload: {
                endpoint: data.url,
                formData: true,
                metaFields: Object.keys( fields ).map( field_key => {
                  return field_key;
                }),
                method: data.method,
              },
            };
            
            this.handleComplete( formattedFile );
          });
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
          this.uploadFile( result );
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
          this.uploadFile( result );
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
                  key={file.id}
                  id={file.id}
                  size={file.size}
                  name={file.name}
                  uploaded={file.uploaded}
                  type={file.type}
                  preview={file.uploadURL}
                  uploadURL={file.uploadURL}
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
