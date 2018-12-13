import '@uppy/dashboard/dist/style.css';

import React, { Component } from 'react';
import { bool, number, func, object, array, string, oneOf, oneOfType } from 'prop-types';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import Webcam from '@uppy/webcam';
import Dashboard from '@uppy/dashboard';
import './inputFile.css';
import { Box, Recursive } from '../../../components';
import InputFileItem from './file-item';
import InputFileTouchable from './file-touchable';
import config from '../../../../config';
import { isArray } from '../../../../utils';

class InputFile extends Component {
  static defaultProps = {
    maxNumberOfFiles: 0,
    autoProceed: true,
    defaultValue: [],
    imageOnly: false,
    multiple: false,
    testID: 'input-file',
  }

  static propTypes = {
    maxNumberOfFiles: number,
    autoProceed: bool,
    onChangeValue: func,
    defaultValue: object,
    value: array,
    imageOnly: bool,
    multiple: bool,
    testID: string,
    renderItem: object,
    renderInput: object,
    margin: number,
    marginX: number,
    marginY: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    padding: number,
    paddingX: number,
    paddingY: number,
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number,
    textAlign: oneOf(
      ['left', 'center','right']
    ),
    height: oneOfType(
      [string, number]
    ),
    width: oneOfType(
      [string, number]
    ),
    backgroundColor: string,
    borderWidth: number,
    borderTopWidth: number,
    borderRightWidth: number,
    borderBottomWidth: number,
    borderLeftWidth: number,
    borderColor: string,
    borderRadius: number,
    borderBottomLeftRadius: number,
    borderBottomRightRadius: number,
    borderTopLeftRadius: number,
    borderTopRightRadius: number,
    wrapperProps: object,
    color: string,
  }

  state = {
    error: null,
    files: [],
  }

  componentDidMount() {
    const { autoProceed } = this.props;

    this.updateFilesFromProps();

    this.uppy = new Uppy({
      autoProceed,
      debug: false,
      restrictions: {
        maxNumberOfFiles: this.props.maxNumberOfFiles,
      },
      onBeforeFileAdded: ( currentFile ) => this.checkFileType( currentFile ),
    })
      .use( Dashboard, {
        closeModalOnClickOutside: true,
        note: this.props.imageOnly
          ? '.jpeg, .jpg, and .png file types allowed only'
          : 'any file type allowed',
        hideProgressAfterFinish: true,
      })
      .use( AwsS3, { serverUrl: config.uppy.url })
      .use( Webcam, { target: Dashboard })
      .run();

    this.uppy.on( 'complete', this.handleComplete );
  }

  componentDidUpdate( prevProps ) {
    if (
      this.props != null &&
      this.props.value !== prevProps.value
    ) {
      this.updateFilesFromProps();
    }
  }

  componentWillUnmount() {
    if ( this.uppy )
      this.uppy.close();
  }

  get modalName() {
    return 'uppy';
  }

  updateFilesFromProps = () => {
    const { value, defaultValue } = this.props;
    let files = [];

    if (
      isArray( value )
    ) {
      this.setState({ files: value });
    }

    try {
      files = ( value && value !== 'null' )
        ? JSON.parse( value )
        : defaultValue;
    } catch ( e ) {
      //
    }

    if (
      isArray( files )
    ) {
      this.setState({ files: files });
    }
  }

  checkFileType = ( currentFile ) => {
    const imageTypes = ['image/jpeg', 'image/png'];

    if (
      !this.props.imageOnly ||
      (
        this.props.imageOnly &&
        imageTypes.includes( currentFile.type )
      )
    ) {
      this.uppy.info( 'Upload successful', 'success', 3000 );

      return true;
    }

    this.uppy.info( 'Invalid file type', 'error', 3000 );

    return false;
  }

  close = () => {
    if ( this.uppy ) {
      if ( this.uppy.getPlugin( 'Dashboard' ).isModalOpen()) {
        this.uppy.getPlugin( 'Dashboard' ).closeModal();
      }
    }
  }

  isValidFile = file => {
    if ( !file.type ) {
      return false;
    }

    if ( !file.id ) {
      return false;
    }

    if ( !file.uploadURL ) {
      return false;
    }

    if ( !file.name ) {
      return false;
    }

    if ( !file.uploaded ) {
      return false;
    }

    if ( !file.size ) {
      return false;
    }

    return true;
  }

  handleComplete = result => {
    this.setState( state => ({
      files: [
        ...state.files,
        ...result.successful.map( file => ({
          ...file,
          uploaded: true,
          id: file.meta.key,
        })),
      ],
    }), this.handleSaveToServer );
  }

  handleSaveToServer = () => {
    const { files } = this.state;

    this.setState({ error: null });

    setTimeout( this.close, 2000 );

    // delete the file object from each data object, it causes problems with fastcopy
    files.forEach( file => file && file.data ? file['data'] = { size: file.size } : file );

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( isArray( files, { ofMinLength: 1 }) ? files : '' );
    }
  }

  handleError = error => {
    this.setState({ error });
  }

  handleOpenModal = () => {
    this.uppy.getPlugin( 'Dashboard' ).openModal();
  }

  handleRemoveFile = fileId => () => {
    this.setState( state => {
      const filteredFiles = state.files.filter(({ id }) => id !== fileId );

      return {
        files: [...filteredFiles],
        itemRemoved: [...filteredFiles],
      };
    }, () => {
      this.handleRefreshUppy();
      this.handleSaveToServer();
    });
  }

  handleRefreshUppy = () => {
    this.uppy.setState({
      files: this.state.files,
    });
  }

  render() {
    const {
      imageOnly,
      multiple,
      testID,
      renderItem,
      renderInput,
      value, // eslint-disable-line
      ...restProps
    } = this.props;

    const { files, error } = this.state;
    const validFiles = files && files.length ? files.filter( file => this.isValidFile( file )) : [];

    return (
      <Box
        width="100%"
        flexDirection="column"
        testID={testID}
      >
        {isArray( validFiles, { ofMinLength: 1 }) && (
          validFiles.map( file => {
            if ( renderItem ) {
              const context = {
                file,
                onRemove: this.handleRemoveFile,
                error,
              };

              return (
                <Recursive
                  {...renderItem}
                  key={file.id}
                  context={context}
                />
              );
            }

            return (
              <InputFileItem
                key={file.id}
                id={file.id}
                size={file.size}
                name={file.name}
                uploaded={file.uploaded}
                type={file.type}
                preview={file.preview}
                uploadURL={file.uploadURL}
                error={error}
                onRemove={this.handleRemoveFile}
              />
            );
          })
        )}

        {(
          isArray( validFiles, { ofExactLength: 0 }) ||
          multiple
        ) && (
          renderInput ? (
            <Recursive
              {...renderInput}
              context={{
                numberOfUploadedFiles: validFiles.length,
                onOpenModal: this.handleOpenModal,
              }}
            />
          ) : (
            <InputFileTouchable
              {...restProps}
              onPress={this.handleOpenModal}
              text={(
              `Click to Upload a${isArray( validFiles, { ofMinLength: 1 }) ? 'nother' : imageOnly ? 'n' : ''} ${imageOnly ? 'image' : 'file'} `
              )}
              testID={testID}
            />
          )
        )}
      </Box>
    );
  }
}

export default InputFile;
