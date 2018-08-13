import React, { Component } from 'react';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import { bool, func, string, shape, number, oneOf, oneOfType, array } from 'prop-types';
import dlv from 'dlv';
import fastXmlParser from 'fast-xml-parser';
import mime from 'react-native-mime-types';
import { Box, alert } from '../../../components';
import InputFileItem from './file-item';
import InputFileTouchable from './file-touchable';
import { isArray } from '../../../../utils';
import config from '../../../../config';

class InputFile extends Component {
  static defaultProps = {
    multiple: false,
    imageOnly: false,
    config: {},
  }

  static propTypes = {
    imageOnly: bool,
    onChange: func,
    onChangeValue: func,
    multiple: bool,
    config: shape({
      title: string,
      cancelButtonTile: string,
      takePhotoButtonTitle: string,
      chooseFromLibraryButtonTitle: string,
      customButtons: array,
      cameraType: oneOf(
        ['front', 'back']
      ),
      mediaType: oneOf(
        ['photo', 'video', 'mixed', 'photo', 'video']
      ),
      maxWidth: oneOfType(
        [number, string]
      ),
      maxHeight: oneOfType(
        [number, string]
      ),
      quality: number,
      videoQuality: oneOf(
        ['low', 'high']
      ),
      durationLimit: number,
      rotation: number,
      allowsEditing: bool,
      noData: bool,
      storageOptions: shape({
        skipBackup: bool,
        path: string,
        cameraRoll: bool,
        waitUntilSaved: bool,
      }),
      permissionDenied: shape({
        tile: string,
        text: string,
        reTryTile: string,
        okTitle: string,
      }),
    }),
  }

  state = {
    files: [],
  }

  componentDidMount() {
    console.warn( this.props );
  }

  handleComplete = result => {
    this.setState( state => {
      if ( this.props.multiple ) {
        return {
          files: state.files.concat( result ),
        };
      }

      return {
        files: [result],
      };
    }, this.propagateParentOnChange );
  }

  propagateParentOnChange = () => {
    const { files } = this.state;

    if ( this.props.onChange )
      this.props.onChange({ target: { value: files } });

    if ( this.props.onChangeValue )
      this.props.onChangeValue( files );
  }

  uploadFile = async result => {
    const { uri, fileName } = result;
    const fileParts = /\.(\w+)$/.exec( fileName );
    const mimeType = fileParts ? mime.contentType( fileParts[1] ).split( ';' )[0] : 'file';
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
      uri,
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

  __legacy__handlePress = async () => {
    const { imageOnly } = this.props;

    if ( imageOnly ) {
      // await Expo.Permissions.askAsync( Expo.Permissions.CAMERA_ROLL );
      // await Expo.Permissions.askAsync( Expo.Permissions.CAMERA );

      try {
        // const result = await ImagePicker.launchImageLibraryAsync({
          // allowsEditing: true,
          // aspect: [4, 3],
        // });

        // if ( !result.cancelled ) {
          // this.uploadFile( result );
        // }
      }
      catch ( e ) {
        // do nothing
      }
    }
    else {
      try {
        // const result = await DocumentPicker.getDocumentAsync();

        // if ( result.type !== 'cancel' ) {
          // this.uploadFile( result );
        // }
      }
      catch ( e ) {
        // do nothing
      }
    }
  }

  handlePress = () => {
    ImagePicker.showImagePicker( this.props.config, response => {
      if ( response.didCancel ) {
        // do nothing
      }
      else if ( response.error ) {
        alert({
          title: 'Error',
          message: response.error,
        });
      }
      else {
        this.uploadFile( response );
      }
    });
  }

  handleRemoveFile = removeId => () => {
    this.setState( prevState => ({
      files: prevState.files.filter(({ id }) => id !== removeId ),
    }), this.propagateParentOnChange );
  }

  render() {
    const { imageOnly, multiple } = this.props;
    const { files } = this.state;

    const multipleFiles = (
      multiple &&
      files.length > 0
    );

    return (
      <Box
        width="100%"
        flexDirection="column"
      >
        {isArray( files, { ofMinLength: 1 }) ? (
          files.map( file => (
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
        ) : null}

        <InputFileTouchable
          onPress={this.handlePress}
          text={
            `Pick a${
              imageOnly
                ? `n${multipleFiles ? 'other' : ''} image from camera roll`
                : `${multipleFiles ? 'nother' : ''} file from your device`
            }`
          }
        />
      </Box>
    );
  }
}

export default InputFile;
