import { TransformText } from '../actions';
import { StoreState } from '../types/index';
import { extract, debug } from 'spotd';

export function transform(state: StoreState, action: TransformText): StoreState {

  switch (action.type) {
    case 'TRANSFORM_TEXT':
      return {
        ...state,
        outputText: extract(action.textToTransform),
        debugText: debug(action.textToTransform)
      };

    default: {
      return state;
    }
  }
}