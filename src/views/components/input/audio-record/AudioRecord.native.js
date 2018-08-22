import React, { Component, Fragment } from 'react';
import { func } from 'prop-types';
import axios from 'axios';
import mime from 'react-native-mime-types';
import fastXmlParser from 'fast-xml-parser';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import dlv from 'dlv';
import uuid from 'uuid/v4';
import { Box, Icon, Touchable, Text, ActivityIndicator } from '../../index';
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
    processing: false,
    calculating: false,
    done: false,
    audioRecorderPlayer: new AudioRecorderPlayer(),
    fileName: '',
  }

  onStartRecord = async () => {
    const { audioRecorderPlayer } = this.state;
    const fileName = `${RNFS.TemporaryDirectoryPath}${uuid()}.m4a`;
    this.setState({ fileName });

    audioRecorderPlayer.id = 123;
    const path = fileName;

    console.warn( path )

    await audioRecorderPlayer.startRecord();

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


    const path = await audioRecorderPlayer.stopRecord();

    this.setState({
      fileName: path
    })

    if ( path && this.props.onChangeValue ) {
      // this.props.onChangeValue( 'record.mp4' );
      this.uploadFile( path, 'record' );
    }
  }

  onStartPlay = async () => {
    const { audioRecorderPlayer, fileName } = this.state;

    const path = fileName;

    await audioRecorderPlayer.startPlay;

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
    const localFileName = this.state.fileName;

    this.setState({ processing: true })

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
      name: uri,
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

    const { Location } = jsonObj.PostResponse;
    const resp = await axios({
      url: 'https://transcoder-eet-dev.outcome-hub.com/transcode',
      method: 'POST',
      data: { Location }
    })

    const newURL = resp.data.Location;
    console.warn({text: this.props.question.name})

    const transcodeResp = await axios({
      url: 'https://scoring-eet-dev.outcome-hub.com/score',
      method: 'POST',
      data: {
        url: newURL,
        text: this.props.question.name
      }
    })



    this.setState({ processing: false, calculating: true })

    const polling = setInterval(
      () => {
        axios({url: `https://scoring-eet-dev.outcome-hub.com/score/${transcodeResp.data.jobID}`})
          .then( resp => {
            console.log(resp);
            if (resp.data.status === "COMPLETE") {
              clearInterval(polling);
              console.log(resp.data);
              this.setState({score: resp.data.score, processing: false, calculating: false, done: true})
              this.props.onChangeValue( newURL );
            }
          })
      }, 1000
    )


    // const { name, fileType } = jsonObj._parts.filter( field => field[0] === 'file' )[0][1];

    // const formattedFile = {
    //   data: {
    //     name: name,
    //     type: fileType,
    //   },
    //   extension: fileType.split( '/' )[1],
    //   id: dlv( jsonObj, 'PostResponse.Key' ),
    //   meta: {
    //     ...fields,
    //     name: name,
    //     type: fileType,
    //   },
    //   name: name,
    //   response: {
    //     body: jsonObj.PostResponse,
    //     status: fields.success_action_status,
    //     uploadURL: dlv( jsonObj, 'PostResponse.Location' ),
    //   },
    //   type: fileType,
    //   uploadURL: dlv( jsonObj, 'PostResponse.Location' ),
    //   uploaded: true,
    //   xhrUpload: {
    //     endpoint: data.url,
    //     formData: true,
    //     metaFields: Object.keys( fields ),
    //     method: data.method,
    //   },
    // };

    // if ( formattedFile && formattedFile.uploadURL && this.props.onChangeValue ) {
    //   console.warn(formattedFile)

    // }
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
    const { playback, recording, processing, calculating, score, done } = this.state;

    return (
      <Box
        flexDirection="row"
        marginTop={10}
        alignItems="center"
        justifyContent="space-around"
      >
      {
        ( !done && processing || calculating)
        ? <Box
          flexDirection="column"
          alignItems="center"
          >
            <ActivityIndicator size="large" />
            {
               <Box
                  flexDirection="column"
                  alignItems="center"
                  >
                  { processing && <Text> processing... </Text> }
                  { calculating && <Text> calculating score... </Text> }
                  </Box>
            }
          </Box>
        : (
          <Fragment>
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

              {score && <Text> {score} out of 100 </Text> }

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
          </Fragment>
        )
      }
      </Box>
    );
  }
}

export default AudioRecord;
