import { TransformText } from '../actions';
import { StoreState } from '../types/index';
import extract from './extractor';

export function transform(state: StoreState, action: TransformText): StoreState {

  switch (action.type) {
    case 'TRANSFORM_TEXT':
      return { 
        ...state, 
        outputText: extract(action.textToTransform).join("\n")
      };
  }

  return state;      
}