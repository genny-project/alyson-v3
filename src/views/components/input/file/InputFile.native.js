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
import config from '../../../../config';

class InputFile extends Component {
  static defaultProps = {
    imageOnly: false,
  }

  static propTypes = {
    imageOnly: bool,
    onChange: func,
    onChangeValue: func,
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
    }), this.propagateParentOnChange );
  }

  propagateParentOnChange = () => {
    const { files } = this.state;

    if ( this.props.onChange )
      this.props.onChange({ target: { value: files } });

    if ( this.props.onChangeValue )
      this.props.onChangeValue( files );
  }

  uploadFile = async ( result ) => {
    const localUri = result.uri;
    const fileName = localUri.split( '/' ).pop();
    const match = /\.(\w+)$/.exec( fileName );
    const mimeType = match ? mime.contentType( match[1] ).split( ';' )[0] : 'file';
    const formData = new FormData();
    const url = config.uppy.url;

    const responseGet = await axios({
      method: 'get',
      url: `${url}params?filename=${fileName}&type=${encodeURIComponent( mimeType )}`,
    });

    if (
      responseGet.status !== 200 ||
      responseGet.data == null ||
      responseGet.data.fields == null
    ) {
      return;
    }

    const data = responseGet.data;
    const fields = responseGet.data.fields;

    Object.keys( fields ).forEach( field_key => {
      formData.append( field_key, fields[field_key] );
    });

    formData.append( 'file', {
      uri: localUri,
      name: fileName,
      fileType: mimeType,
    });

    const responsePost = await fetch( responseGet.data.url, {
      method: 'POST',
      body: formData,
      header: {
        'content-type': 'multipart/form-data',
      },
    });

    const text = await responsePost.text();

    const jsonObj = fastXmlParser.parse( text );
    const { name, fileType } = formData._parts.filter( field => field[0] === 'file' )[0][1];

    const formattedFile = {
      data: {
        name: name,
        type: fileType,
      },
      extension: fileType.split( '/' )[1],
      id: dlv( jsonObj, 'PostResponse.Key' ),
      meta: {
        ...fields,
        name: name,
        type: fileType,
      },
      name: name,
      response: {
        body: jsonObj.PostResponse,
        status: fields.success_action_status,
        uploadURL: dlv( jsonObj, 'PostResponse.Location' ),
      },
      type: fileType,
      uploadURL: dlv( jsonObj, 'PostResponse.Location' ),
      uploaded: true,
      xhrUpload: {
        endpoint: data.url,
        formData: true,
        metaFields: Object.keys( fields ),
        method: data.method,
      },
    };

    this.handleComplete( formattedFile );
  }

  handlePress = async () => {
    const { imageOnly } = this.props;

    if ( imageOnly ) {
      await Expo.Permissions.askAsync( Expo.Permissions.CAMERA_ROLL );
      await Expo.Permissions.askAsync( Expo.Permissions.CAMERA );

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
        const result = await DocumentPicker.getDocumentAsync();

        if ( result.type !== 'cancel' ) {
          this.uploadFile( result );
        }
      }
      catch ( e ) {
        // do nothing
      }
    }
  }

  handleRemoveFile = removeId => () => {
    this.setState( prevState => ({
      files: prevState.files.filter(({ id }) => id !== removeId ),
    }), this.propagateParentOnChange );
  }

  render() {
    const { imageOnly } = this.props;
    const { files } = this.state;

    return (
      <Box
        width="100%"
        flexDirection="column"
      >
        {(
          files &&
          files instanceof Array &&
          files.length > 0
        )
          ? files.map( file => (
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
          ))
          : null}

        <InputFileTouchable
          onPress={this.handlePress}
          text={
            `Pick a${
              imageOnly
                ? `n${files.length > 0 ? 'other' : ''} image from camera roll`
                : `${files.length > 0 ? 'nother' : ''} file from your device`
            }`
          }
        />
      </Box>
    );
  }
}

export default InputFile;
