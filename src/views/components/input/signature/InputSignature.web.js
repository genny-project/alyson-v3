import React, { Component } from 'react';
import { string, number, oneOfType, func } from 'prop-types';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { SIGNATURE_URL } from '../../../../config';
import { Tabs, InputText , Input, Button } from '../../../components';

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
        url: SIGNATURE_URL,
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
      <div className="custom-signature">
        <Tabs
          tabBackground="#f5f5f5"
          activeTabbackground="teal"
          width="100%"
          padding={30}
          paddingTop={40}
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
          <div>
            <SignatureCanvas
              ref={ref => this.signaturePad = ref}
              backgroundColor="#f5f5f5"
              canvasProps={
                {
                  height: '250px',
                  width: '400px',
                  marginTop: 0,
                  className: 'sigCanvas',
                }
                }
              onend={this.handleSignatureSubmitOnDraw} /* eslint-disable-line  */
            />
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: 10 }}>
              <div style={{ width: '100%' }}>
                <Button
                  onPress={this.handleClearCanvas}
                  color="red"
                  withFeedback
                  style={{ marginTop: '10px' }}
                >
                  Reset
                </Button>
              </div>
              <div style={{ width: '100%' }}>
                <Button
                  onPress={this.handleSignatureSubmitOnDraw}
                  color="green"
                  withFeedback
                  style={{ marginTop: '10px' }}
                >
                  Submit
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
