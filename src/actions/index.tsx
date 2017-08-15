import * as constants from '../constants'

export interface TransformText {
    type: constants.TRANSFORM_TEXT
    textToTransform: string
}

export function transformText(text: string): TransformText {
    return {
        type: constants.TRANSFORM_TEXT,
        textToTransform: text
    }
}

