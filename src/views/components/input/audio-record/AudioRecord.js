import React, { Component } from 'react';
import { Box, Icon, Touchable } from '../../index';

class AudioRecord extends Component {
  static defaultProps = {
  }

  static propTypes = {
  }

  state = {
  }

  handlePlayback = () => {
    this.setState( state => ({
      playback: !state.playback,
    }));
  }

  handleRecord = () => {
    this.setState( state => ({
      recording: !state.recording,
    }));
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
