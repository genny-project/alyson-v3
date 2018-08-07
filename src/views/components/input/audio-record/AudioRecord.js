import React, { Component } from 'react';
import { func } from 'prop-types';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Box, Icon, Touchable } from '../../index';

class AudioRecord extends Component {
  static defaultProps = {
  }

  static propTypes = {
    onChangeValue: func,
  }

  state = {
    playback: false,
    recording: false,
  }

  componentDidMount() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  onStartRecord = async () => {
    const audioRecorderPlayer = this.audioRecorderPlayer;

    await audioRecorderPlayer.startRecord();
    this.setState( state => ({
      recording: !state.recording,
    }));
  }
  
  onStopRecord = async () => {
    const audioRecorderPlayer = this.audioRecorderPlayer;

    await audioRecorderPlayer.stopRecord();

    this.setState( state => ({
      recordSecs: 0,
      recording: !state.recording,
    }));
  }
  
  onStartPlay = async () => {
    const audioRecorderPlayer = this.audioRecorderPlayer;

    await audioRecorderPlayer.startPlay();
    this.setState( state => ({
      playback: !state.playback,
    }), () => {
      this.props.onChangeValue( this.state.playback );
    });
  }
  
  onPausePlay = async () => {
    const audioRecorderPlayer = this.audioRecorderPlayer;

    await audioRecorderPlayer.pausePlay();
  }
  
  onStopPlay = async () => {
    const audioRecorderPlayer = this.audioRecorderPlayer;

    audioRecorderPlayer.stopPlay();
    audioRecorderPlayer.removePlayBackListener();

    this.setState( state => ({
      playback: !state.playback,
    }), () => {
      this.props.onChangeValue( this.state.playback );
    });
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
