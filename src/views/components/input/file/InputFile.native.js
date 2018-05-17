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
    Expo.Permissions.askAsync( Expo.Permissions.CAMERA_ROLL ).then(
      () => {
        Expo.Permissions.askAsync( Expo.Permissions.CAMERA ).then(
          () => {
            // Expo.ImagePicker.launchCameraAsync(options)
            ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
            }).then(
              ( result ) => {
                if ( !result.cancelled ) {
                  this.setState({ image: result.uri });
                }
              }
            );
          }
        );
      }
    );
  };

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
