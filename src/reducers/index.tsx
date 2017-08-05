import { TransformText } from '../actions';
import { StoreState } from '../types/index';

export function transform(state: StoreState, action: TransformText): StoreState {

  switch (action.type) {
    case 'TRANSFORM_TEXT':
      return { ...state, outputText: action.textToTransform = action.textToTransform.toLowerCase() };
  }

  return state;      
}