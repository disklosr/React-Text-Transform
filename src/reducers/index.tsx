import { TransformText } from '../actions';
import { StoreState } from '../types/index';
import extract, {debug} from './extractor';

export function transform(state: StoreState, action: TransformText): StoreState {

  switch (action.type) {
    case 'TRANSFORM_TEXT':
      return { 
        ...state, 
        outputText: extract(action.textToTransform).join("\n"),
        debugText: debug(action.textToTransform)
      };
  }

  return state;      
}