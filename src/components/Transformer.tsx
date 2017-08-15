import * as React from 'react';
import './Transformer.css';
import AppBar from 'material-ui/AppBar';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid';

export interface Props {
  outputText: string
  debugText: string
  onTransform: (text: string) => void;
}

export interface State {
  value: string
}

const sampleEmail =
  `
Hello,

This is a test email.

Regards,

Harry Potter
Software Wizard
Microsoft
14 Rue Amber, Paris, France
+33 6 45 56 67 67
http://github.com/talon

This line should not be captured as it is not a part of the signature.
`;


class Transformer extends React.Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = { value: sampleEmail };
  }

  handleChange = (event: any) => {
    this.setState({ value: event.target.value } as State)
  }

  render() {
    const { outputText, debugText, onTransform } = this.props;

    return (
      <div>
        <AppBar
          style={{position: 'fixed', top: 0}}
          title="Spotd"
          iconElementRight={
            <div>
              <RaisedButton label="View On Github" primary={false} style={{margin: 6}} href="https://github.com/disklosr/spotd" />
              <RaisedButton label="Extract Signature" secondary={true} style={{margin: 6}} onClick={() => onTransform(this.state.value)} />
            </div>}
        />
        <div className="main-content">
          <Grid fluid>
            <Row>
              <Col xs>
                <Card>
                  <CardHeader title="Original Email" />
                  <CardText>
                    <TextField id='debug-text'
                      hintText="Paste in an email message in html format"
                      multiLine={true}
                      fullWidth={true}
                      rows={5}
                      value={this.state.value}
                      onChange={this.handleChange}
                    />
                  </CardText>
                </Card>
              </Col>
              <div style={{height: '18px'}}/>
              <Col xs>
                <Card>
                  <CardHeader title="Extracted Signature" />
                  <CardText>
                    <TextField
                      hintText="Paste in an email message in html format"
                      multiLine={true}
                      fullWidth={true}
                      disabled={true}
                      rows={5}
                      value={outputText}
                    />
                  </CardText>
                </Card>
              </Col>
            </Row>
            <div className="separator"/>
            <Row>
              <Col xs={12}>
                <Card>
                  <CardHeader title="Debug info" />
                  <CardText>
                    <TextField
                      style={{
                        fontSize: 12,
                        fontFamily: 'monospace'
                      }}
                      multiLine={true}
                      fullWidth={true}
                      disabled={true}
                      rows={5}
                      value={debugText}
                    />
                  </CardText>
                </Card>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Transformer;