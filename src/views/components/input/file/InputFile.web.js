import 'uppy/dist/uppy.min.css';
import React, { Component } from 'react';
import { bool, number, func, object, array, any } from 'prop-types';
import Uppy from 'uppy/lib/core';
import AwsS3 from 'uppy/lib/plugins/AwsS3';
import Webcam from 'uppy/lib/plugins/Webcam';
import Dashboard from 'uppy/lib/plugins/Dashboard';
import { Box } from '../../../components';
import InputFileItem from './file-item';
import InputFileTouchable from './file-touchable';

class InputFile extends Component {
  static defaultProps = {
    maxNumberOfFiles: 0,
    autoProceed: true,
    defaultValue: [],
    identifier: null,
    imageOnly: false,
  }

  static propTypes = {
    maxNumberOfFiles: number,
    autoProceed: bool,
    onChange: func,
    defaultValue: object,
    value: array,
    validation: func,
    validationList: array,
    identifier: any,
    imageOnly: bool,
  }

  state = {
    error: null,
    files: [],
  }

  componentDidMount() {
    let files = [];

    try {
      files = ( this.props.value && this.props.value !== 'null' ) ? JSON.parse( this.props.value ) : this.props.defaultValue;
    } catch ( e ) { 
      //
    }

    this.setState({
      files,
    }, () => {
      // console.log( this.state );
    });
  }

  componentWillUnmount() {
    if ( this.uppy ) {
      this.uppy.close();
    }
    removeEventListener( 'hashchange', this.handleHashChange, false );
  }

  get modalName() {
    return 'uppy';
  }

  checkFileType = ( currentFile ) => {
    const imageTypes = ['image/jpeg', 'image/png'];

    if ( 
      !this.props.imageOnly || 
      ( this.props.imageOnly &&
        imageTypes.includes( currentFile.type ))
    ) {
      this.uppy.info( 'Upload successful', 'success', 3000 );
      
      return true;
    }
    this.uppy.info( 'Invalid file type', 'error', 3000 );
    
    return false;
  }

  handleComplete = result => {
    // console.log( this.state, result );

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

    // console.log('Upload', files);

    setTimeout(() => {
      // console.log('closing');
      this.close();
    }, 2000 );

    const restructuredFiles = files;
    const { validationList, validation, identifier } = this.props;

    if ( validation ) validation( JSON.stringify( restructuredFiles ), identifier, validationList );
  }

  handleSuccess = success => {
    const uploadedFiles = success.response.map(({ id }) => id );
    // console.log('success');
    /* Update all the  */

    this.setState( state => ({

      files: [
        ...state.files.filter(({ id }) => !uploadedFiles.includes( id )),
        success.response,
      ],
    }), () => {
      if ( this.props.onChange ) {
        this.props.onChange({ target: { value: this.state.files } });
      }
    });
  }

  handleError = error => {
    this.setState({ error });
  }

  handleOpenModal = () => {
    this.uppy.getPlugin( 'Dashboard' ).openModal();

    /* Append some text in the location hash so that when the user
    * navigates backwards in browser history, the modal closes. */
    if ( !window.location.hash.includes( this.modalName )) {
      if ( window.location.hash ) {
        window.location.hash += `,${this.modalName}`;
      } else {
        window.location.hash = this.modalName;
      }
    }

    /* Listen for if the user presses the back button. */
    addEventListener( 'hashchange', this.handleHashChange, false );
  }

  handleHashChange = () => {
    /* If the location hash no longer contains our text, the user has
    * pressed back in their browser and we should close the modal. */
    if (  !window.location.hash.includes( this.modalName )) {
      this.uppy.getPlugin( 'Dashboard' ).closeModal();

      /* Clean up the event listener. */
      removeEventListener( 'hashchange', this.handleHashChange, false );
    }
  }

  handleRemoveFile = fileId => () => {
    this.setState( state => ({ files: state.files.filter(({ id }) => id !== fileId ) }), () => {
      this.handleRefreshUppy();
      this.handleSaveToServer();
    });
  }

  handleRefreshUppy = () => {
    this.uppy.setState({
      files: this.state.files,
    });
  }

  close = () => {
    this.uppy.getPlugin( 'Dashboard' ).closeModal();
    // console.log('closed');
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

  componentDidReceiveProps( nextProps ) {
    let files = [];

    try {
      files = ( nextProps.value && nextProps.value !== 'null' ) ? JSON.parse( nextProps.value ) : nextProps.defaultValue;
    } catch ( e ) { 
      //
    }

    this.setState({
      files,
    }, () => {
      // console.log( this.state );
    });
  }

  componentWillMount() {
    const { autoProceed } = this.props;

    /** const hosturlattr = BaseEntityQuery.getBaseEntityAttribute(
    * GennyBridge.getProject(), 'PRI_UPPY_URL'
    * );
    */
    // if (hosturlattr != null && hosturlattr.value != null) {

    this.uppy = new Uppy({
      autoProceed,
      debug: false,
      restrictions: {
        maxNumberOfFiles: this.props.maxNumberOfFiles,
        // allowedFileTypes: this.props.allowedFileTypes,
      },
      onBeforeFileAdded: ( currentFile ) => this.checkFileType( currentFile ),
    })
      .use( Dashboard, {
        closeModalOnClickOutside: true,
        note: this.props.imageOnly ? '.jpeg, .jpg, and .png file types allowed only' : 'any file type allowed',
        hideProgressAfterFinish: true,
      })
      .use( AwsS3, { host: 'https://uppych40.channel40.com.au' })
      .use( Webcam, { target: Dashboard })
      .run();

    this.uppy.on( 'complete', this.handleComplete );
    // }
  }

  render() {
    const { imageOnly } = this.props;
    const { files, error } = this.state;
    const validFiles = files && files.length ? files.filter( file => this.isValidFile( file )) : [];

    return (
      <Box
        width="100%"
        flexDirection="column"
      >
        {
          validFiles && validFiles.length > 0 && (
            validFiles.map( file => {
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
          )
        }
        <InputFileTouchable
          onPress={this.handleOpenModal}
          text={
            `Click to Upload a${validFiles.length > 0 ? 'nother' : imageOnly ? 'n' : ''} ${imageOnly ? 'image' : 'file'} `
          }
        />
      </Box>
    );
  }
}

export default InputFile;
