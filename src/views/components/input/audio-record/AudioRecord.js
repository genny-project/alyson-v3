import React, { Component } from 'react';
import { func } from 'prop-types';
import axios from 'axios';
import mime from 'react-native-mime-types';
import fastXmlParser from 'fast-xml-parser';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import dlv from 'dlv';
import { Box, Icon, Touchable } from '../../index';
import config from '../../../../config';

var RNFS = require( 'react-native-fs' );

class AudioRecord extends Component {
  static defaultProps = {
  }

  static propTypes = {
    onChangeValue: func,
  }

  state = {
    playback: false,
    recording: false,
    audioRecorderPlayer: new AudioRecorderPlayer(),
  }

  onStartRecord = async () => {
    const { audioRecorderPlayer } = this.state;

    audioRecorderPlayer.id = 123;
    const path = `${RNFS.TemporaryDirectoryPath}sound.m4a`;

    await audioRecorderPlayer.startRecord( path );
    this.setState( state => ({
      recording: !state.recording,
    }));
  }
  
  onStopRecord = async () => {
    const { audioRecorderPlayer } = this.state;

    this.setState( state => ({
      recordSecs: 0,
      recording: !state.recording,
    }));

    await audioRecorderPlayer.stopRecord();

    const path = `${RNFS.TemporaryDirectoryPath}sound.m4a`;

    if ( path && this.props.onChangeValue ) {
      this.props.onChangeValue( 'record.mp4' );
    //  this.uploadFile( path, 'record' );
    }
  }

  onStartPlay = async () => {
    const { audioRecorderPlayer } = this.state;

    const path = `${RNFS.TemporaryDirectoryPath}sound.m4a`;

    await audioRecorderPlayer.startPlay( path );

    this.setState( state => ({
      playback: !state.playback,
    }));
  }
  
  onPausePlay = async () => {
    const { audioRecorderPlayer } = this.state;

    await audioRecorderPlayer.pausePlay();
  }
  
  onStopPlay = async () => {
    const { audioRecorderPlayer } = this.state;

    audioRecorderPlayer.stopPlay();
    audioRecorderPlayer.removePlayBackListener();

    this.setState( state => ({
      playback: !state.playback,
    }));
  }

  uploadFile = async ( uri, fileName ) => {
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

    if ( formattedFile && formattedFile.uploadURL && this.props.onChangeValue ) {
      this.props.onChangeValue( formattedFile.uploadURL );
    }
  }

  handlePlayback = () => {
    const { playback } = this.state;

    if ( playback ) {
      this.onStopPlay();
    }
    else {
      this.onStartPlay();
    }
  }

  handleRecord = () => {
    const { recording } = this.state;

    if ( recording ) {
      this.onStopRecord();
    }
    else {
      this.onStartRecord();
    }
  }

  render() {
    // const { items } = this.props;
    const { playback, recording } = this.state;

    return (
      <Box
        flexDirection="row"
        marginTop={10}
        alignItems="center"
        justifyContent="space-around"
      >
        <Touchable
          withFeedback
          onPress={this.handleRecord}
        >
          <Box
            padding={10}
            backgroundColor="red"
            shape="circle"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              name={recording ? 'stop' : 'mic'}
              color="white"
              size="lg"
            />
          </Box>
        </Touchable>
        <Touchable
          withFeedback
          onPress={this.handlePlayback}
        >
          <Box
            marginLeft={10}
            padding={10}
            backgroundColor="green"
            shape="circle"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              name={playback ? 'pause' : 'play-arrow'}
              color="white"
              size="lg"
            />
          </Box>
        </Touchable>
      </Box>
    );
  }
}

export default AudioRecord;
