import React, { Component } from 'react';
import { string,number,oneOfType } from 'prop-types';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { Tabs, InputText , Input, Button } from '../../../components';
import './signature.css';

// ! text done, draw done, upload remaining
class Signature extends Component {
  static defaultProps = { 
    height: '250px',
    width: '400px',
    signatureUrl: '',
  }
  
  static propTypes = {
    height: oneOfType( [number, string] ),
    width: oneOfType( [number, string] ),
    signatureUrl: string,
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
    const dataFromDrawingPad = this.signaturePad.toData();

    this.submitSignature( dataFromDrawingPad );
  }

  /* submit text  signature data */
  handleSignatureSubmitOnText = () => {
    const { textSignatureValue } = this.state;

    this.submitSignature( textSignatureValue );
  }

  /* Helper method for submitting */
  submitSignature = ( dataFromDrawingPad ) => {
    const { signatureUrl } = this.props;

    if ( signatureUrl  ) {
      axios({
        method: 'post',
        url: signatureUrl,
        data: dataFromDrawingPad,
      }).then( response => {
        console.warn( response );
      });
    }
  };

  /* handle text signature change */
  handleTextSignatureChange = ( e ) => {
    const  textValue = e.target.value;
  
    this.setState({
      textSignatureValue: textValue,
    });
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

export default Signature;
