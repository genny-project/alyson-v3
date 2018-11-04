import React, { Component } from 'react';
import { string, number, oneOfType, func } from 'prop-types';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import config from '../../../../config';
import { Tabs, Input, Button, Box, Touchable, Icon, Text } from '../../../components';
import './InputSignature.css';

class InputSignature extends Component {
  static defaultProps = {
    height: '250px',
    width: '400px',
  }

  static propTypes = {
    height: oneOfType( [number, string] ),
    width: oneOfType( [number, string] ),
    onChangeValue: func,
  }

  state = {
    textSignatureValue: '',
  }

  componentDidMount() {
    this.signaturePad.height = this.props.height;
    this.signaturePad.width = this.props.width;
  }

  /* clears out the signature canvas drawing pad */
  handleClearCanvas = () => {
    this.signaturePad.clear();
  }

  /* submit thw signature data  from canvas */
  handleSignatureSubmitOnDraw = () => {
    const dataFromDrawingPad = this.signaturePad.toDataURL();

    this.submitSignature({ type: 'draw', data: dataFromDrawingPad });
  }

  /* submit text  signature data */
  handleSignatureSubmitOnText = () => {
    const { textSignatureValue } = this.state;

    this.submitSignature({ type: 'draw', data: textSignatureValue });
  }

  /* Helper method for submitting */
  submitSignature = async ( dataFromDrawingPad ) => {
    try {
      const { data } = await axios({
        method: 'POST',
        url: config.signature.url,
        data: dataFromDrawingPad,
      });

      if ( this.props.onChangeValue )
        this.props.onChangeValue( data.signatureURL );
    }
    catch ( error ) {
      // eslint-disable-next-line no-console
      console.log( 'Error while sending the signature', error );
    }
  };

  /* handle text signature change */
  handleTextSignatureChange = event => {
    const { value } = event.target;

    this.setState({ textSignatureValue: value });
  }

  render() {
    return (
      <Box
        className="input-signature"
        width="100%"
      >
        <Tabs
          tabBackground="#f5f5f5"
          activeTabbackground="teal"
          width="100%"
          padding={20}
          tabBarBackground="#f1f1f1"
          tabBarSize="md"
          textColor="black"
          tabs={[
            { key: 0, title: 'Draw' },
            { key: 1, title: 'Write' },
            { key: 2, title: 'Upload' },
          ]}
        >
          <Box
            width="100%"
            display="block"
            position="relative"
          >
            <Box
              marginBottom={20}
              justifyContent="center"
            >
              <Text
                align="center"
                color="white"
                bold
                size="xl"
              >
                Please sign below
              </Text>
            </Box>

            <SignatureCanvas
              ref={ref => this.signaturePad = ref}
              backgroundColor="#f5f5f5"
              canvasProps={{
                height: '250px',
                width: '400px',
                marginTop: 0,
                className: 'sigCanvas',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block',
              }}
              onend={this.handleSignatureSubmitOnDraw} /* eslint-disable-line  */
            />

            <Touchable
              onPress={this.handleClearCanvas}
              withFeedback
              padding={10}
              position="absolute"
              top={0}
              right={0}
              zIndex={10}
            >
              <Icon
                name="undo"
                color="white"
              />
            </Touchable>
          </Box>

          <Box
            width="100%"
            backgroundColor="white"
            padding={20}
          >
            <Input
              type="text"
              size="lg"
              textSize="sm"
              padding={10}
              backgroundColor="#f1f1f1"
              borderSize={1}
              width="100%"
              onChange={this.handleTextSignatureChange}
              value={this.state.textSignatureValue}
            />

            <p style={{ fontFamily: 'satisfy', fontSize: 20 }}>
              {' '}
              {this.state.textSignatureValue}
            </p>

            <Button
              onPress={this.handleSignatureSubmitOnText}
              color="green"
              withFeedback
              style={{ marginTop: '10px' }}
            >
              Submit
            </Button>
          </Box>
        </Tabs>
      </Box>
    );
  }
}

export default InputSignature;
