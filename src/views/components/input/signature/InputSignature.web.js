import React, { Component } from 'react';
import { string, number, oneOfType } from 'prop-types';
import axios from 'axios';
import SignaturePad from 'react-signature-pad-wrapper';
import config from '../../../../config/config.web';
import { Tabs, InputText , Input, Button } from '../..';

const SIGNATURE_URL = config.SIGNATURE_URL;

class InputSignature extends Component {
  static defaultProps = {
    height: '100%',
    width: '100%',
  }
 
   static propTypes = {
     height: oneOfType( [string, number] ),
     width: oneOfType( [string, number] ),
   }

  state = {
    textSignatureValue: '',
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

  // clear the canvas
  handleClearCanvas = () => { 
    this.signaturePad.clear();
  }

  /* Helper method for submitting */
  submitSignature = async ( dataFromDrawingPad ) => {
    try {
      axios({
        method: 'post',
        url: SIGNATURE_URL,
        data: dataFromDrawingPad,
      }).then( data => {
        if ( this.props.onChangeValue ) //eslint-disable-line
          this.props.onChangeValue( data.data.signatureURL );
      });
    }
    catch ( error ) {
      console.error( 'Error while sending the signature', error );
    }
  };

  /* handle text signature change */
  handleTextSignatureChange = event => {
    const { value } = event.target;

    this.setState({ textSignatureValue: value });
  }

  render() {
    const { height, width } = this.props;

    return (
      <div
        className="custom-signature"
        style={{ width: width, height: height }}
      >
        <Tabs
          tabBackground="#f5f5f5"
          activeTabBackground="#afafaf"
          width="100%"
          tabBarBackground="#f1f1f1"
          tabBarSize="md"
          textColor="black"
          tabs={
          [
            { key: 0, title: 'Draw ' },
            { key: 1, title: 'Write ' },
            { key: 2, title: 'Upload ' },
          ]
          }
        >
          <div style={{ width: '100%', height: height, margin: '20px', 
            background: '#f9f9f9' }}
          >
            <SignaturePad
              ref={ref => this.signaturePad = ref}
              backgroundColor="red"
              redrawOnResize
              onend={this.handleSignatureSubmitOnDraw} // eslint-disable-line
            />
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', backgroundColor: 'whitesmoke' }}>
              <div style={{ width: '100%' }}>
                <Button
                  width="100%"
                  onPress={this.handleClearCanvas}
                  color="red"
                  withFeedback
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  Reset
                </Button>
              </div>
              <div style={{ width: '100%' }}>
                <Button
                  width="100%"
                  onPress={this.handleSignatureSubmitOnDraw}
                  color="green"
                  withFeedback
                >
                  Validate
                </Button>

              </div>
            </div>
          </div>
          <div style={{ width: '100%', marginTop: 20 ,backgroundColor: '#fff', padding: 20 }}>
            <InputText
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
          </div>
          <div style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: '#fff' }}>
            <Input type="upload" />
          </div>
        </Tabs>
      </div>
    );
  }
}

export default InputSignature;
