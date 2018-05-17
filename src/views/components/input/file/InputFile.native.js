import React, { Component } from 'react';
import Expo, { ImagePicker } from 'expo';
import { View, Image, Button } from 'react-native';

class InputFile extends Component {
  static defaultProps = {
  }

  static propTypes = {
  }
  
  state = {
    image: null,
  };

  handlePress = async () => {
    await Expo.Permissions.askAsync( Expo.Permissions.CAMERA_ROLL );
    await Expo.Permissions.askAsync( Expo.Permissions.CAMERA );
    // Expo.ImagePicker.launchCameraAsync(options)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if ( !result.cancelled ) {
        this.setState({ image: result.uri });
      }
    }
    catch ( e ) {
      // do nothing
    }
  }

  render() {
    const { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this.handlePress}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }
}

export default InputFile;
