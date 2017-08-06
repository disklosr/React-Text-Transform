import * as React from 'react';
import './Transformer.css';
import AppBar from 'material-ui/AppBar';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Grid, Row, Col } from 'react-flexbox-grid';

export interface Props {
  outputText: string
  onTransform: (text: string) => void;
}

export interface State {
  value: string
}


class Transformer extends React.Component<Props, State> {

  handleChange = (event: any) => {
    this.setState({ value: event.target.value } as State)
  }

  render() {
    const { outputText, onTransform } = this.props;

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
                    <TextField
                      hintText="Paste in an email message in html format"
                      multiLine={true}
                      fullWidth={true}
                      rows={5}
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
          </Grid>
        </div>
      </div>
    );
  }
}

/* function Transformer2({ inputText, outputText, onTransform }: Props) {
  return (
    <div>
      <AppBar
        title="Title"
        iconElementRight={<FlatButton label="Transform" onClick={onTransform} />}
      />
      <div className="main-content">
        <Card>
          <CardHeader title="Input" />
          <CardText>
            <TextField
              hintText="Paste in an email message in html format"
              multiLine={true}
              fullWidth={true}
              rows={5}
              value={inputText}
            />
          </CardText>
        </Card>
        <br />
        <br />
        <Card>
          <CardHeader title="Output" />
          <div>
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
          </div>
        </Card>
        <div>
          <RaisedButton onClick={onTransform} className="transform-button" primary={true} label="Transform" />
        </div>
      </div>
    </div>
  );
} */

export default Transformer;