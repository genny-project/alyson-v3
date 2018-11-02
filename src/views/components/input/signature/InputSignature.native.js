import React, { Component } from 'react';
import { number, string } from 'prop-types';
import SignatureCapture from 'react-native-signature-capture';
import axios from 'axios';
import {  Dimensions } from 'react-native';
import { Box, Button, Tabs, Label, Input  } from '../..';

class InputSignature extends Component {
  static defaultProps = {
    width: Dimensions.get( 'window' ).width,
    height: 550,
    uploadLabel: 'Upload your signature image',
    typeLabel: 'Type to generate a signatre',
    signatureUrl: '',
  }

  static propTypes = {
    width: number,
    height: number,
    uploadLabel: string,
    typeLabel: string,
    signatureUrl: string,
  }

  state = {
    imageData: null,
    inputSignatureText: null,
  }

  /* clear the drawing canvas */
  handleClearCanvas = () => {
    this.signaturePad.resetImage();
  }

  /* handle drawn signature data submit */
  handleSubmitSignature = ( image ) => {
    this.signaturePad.saveImage();
    this.setState({
      imageData: image,
    });

    /* submit base64 encoded data to the API */
    this.submitSignature( this.state.imageData );
  }

  /* handle text signature data change */
  handleChangeText = ( text ) => {
    this.setState({
      inputSignatureText: text,
    });
  }

  /* submit signature for text data */
  handleSubmitTextSignature = () => {
    this.submitSignature( this.state.inputSignatureText );
  }

  /* submit signature to the API */
  submitSignature = ( dataFromDrawingPad ) => {
    const { url } = this.props.signatureUrl;

    if ( url ) {
      axios({
        method: 'post',
        url: url.value,
        data: dataFromDrawingPad, /* send the encoded data from the state */
      }).then(() => {
      });
    }
  };

  render() {
    const { height, width,uploadLabel, typeLabel } = this.props;
    const { inputSignatureText } = this.state;

    return (
      <Box
        height={height}
        width={width}
      >
        <Tabs
          tabs={
          [
            { key: 0, title: 'Draw ' },
            { key: 1, title: 'Type' },
            { key: 2, title: 'Upload' },
          ]
          }
          tabBackground="#f4f4f4"
          tabBarBackground="#f9f9f9"
          activeLabelColor="teal"
          height={height}
          width={width}
        >

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <SignatureCapture
              ref={ref => this.signaturePad = ref}
              showTitleLabel={false}
              showNativeButtons={false}
              height={350}
              width={this.props.width}
              onSaveEvent={this.handleSubmitSignature}
            />
            <Box
              height={250}
              width={width}
              flexDirection="column"
            >

              <Button
                color="red"
                withFeedback
                style={{ marginTop: '10px' }}
                onPress={() => { this.handleClearCanvas();}}
              >
            Reset
              </Button>
              <Button
                color="green"
                withFeedback
                style={{ marginTop: '20px' }}
                onPress={() => { this.handleSubmitSignature();}}
              >
                Submit
              </Button>
            </Box>
          </Box>

          <Box
            height={400}
            width="100%"
            backgroundColor="#fff"
          >
            <Box
              height={230}
              padding={20}
              flexDirection="column"
              justifyContent="space-around"
            >
              <Label
                style={
                {
                  color: '#000',
                }}
                text={typeLabel}
              />
              <Box>

                <Input
                  height={50}
                  width="100%"
                  borderWidth={1}
                  padding={5}
                  borderColor="grey"
                  onChangeText={this.handleChangeText}
                  type="text"
                />
              </Box>
              <Label
                style={{ fontFamily: 'Zapfino' }}
                text={inputSignatureText}
              />

              <Box
                height={50}
                width={width}
                flexDirection="column"
              >
                <Button
                  color="green"
                  withFeedback
                  style={{ marginTop: '20px' }}
                  onPress={() => { this.handleSubmitTextSignature();}}
                >
                Submit
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            height={400}
            width={this.props.width}
            backgroundColor="white"
          >
            <Box
              height={230}
              padding={20}
              flexDirection="column"
              justifyContent="space-around"
            >
              <Label
                text={uploadLabel}
              />
              <Input
                height={50}
                width="150px"
                borderWidth={1}
                padding={5}
                borderColor="grey"
                type="image"
                multiple={false}
              />
              <Box
                height={50}
                width={width}
                flexDirection="column"
              >
                <Button
                  color="green"
                  withFeedback
                  style={{ marginTop: '20px' }}
                  onPress={() => { this.handleSubmitSignature();}}
                >
                Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </Tabs>
      </Box>
    );
  }
}

export default InputSignature;
