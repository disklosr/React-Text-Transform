import Transformer from '../components/Content/Transformer';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';


export function mapStateToProps({ outputText, debugText }: StoreState) {
  return {
    outputText: outputText,
    debugText: debugText
  }
};

interface StateProps{
  outputText: string
  debugText: string
}

interface DispatchProps{
  (txt: string): void
}

export function mapDispatchToProps(dispatch: Dispatch<actions.TransformText>) {
  return {
    onTransform: (text: string) => dispatch(actions.transformText(text))
  }
};

export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(Transformer);

