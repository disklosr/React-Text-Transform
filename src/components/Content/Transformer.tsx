import * as React from 'react';
import './Transformer.css';
import AppBar from 'material-ui/AppBar';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
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
Software Engineer
Microsoft
14 Rue Amber, Paris, France
+33 6 45 56 67 67
http://github.com/talon
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
          title="Email Parser"
          iconElementRight={<FlatButton label="Transform" onClick={() => onTransform(this.state.value)} />}
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

              <Col xs>
                <Card>
                  <CardHeader title="Cleaned up email" />
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
            <div style={{height: '18px'}}/>
            <Row>
              <Col xs={12}>
                <Card>
                  <CardHeader title="Debug info" />
                  <CardText>
                    <TextField
                      style={{
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