let nlp = require('compromise');
let natural = require('natural');

let tokenizer = new natural.WordTokenizer();

const stopwords = {
    french: require('./stopwords-fr.json'),
    english: require('./stopwords-en.json')
}

let selectedStopWords = stopwords.english;

const maxLengthOfSignatureLine = 60;

const phoneRegex = /\+?\(?\d*\)? ?\(?\d+\)?\d*([\s.\-]\d{2,})+/g;
const emailRegex = /\b[a-z0-9-_.]+@[a-z0-9-_.]+(\.[a-z0-9]+)+/i;
const urlRegex = new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/, 'gi')

export enum Features {
    EMPTY_LINE = 'EMPTY_LINE',
    PHONE = 'PHONE',
    EMAIL = 'EMAIL',
    LINK = 'LINK', 
    LONG_LINE = 'LONG_LINE',
    FULL_NAME = 'FULL_NAME',
    SENTENCE = 'SENTENCE',
    NO_STOP_WORDS = 'NO_STOP_WORDS',
    CAPITAL_CASE = 'CAPITAL_CASE',
    DOUBLE_DASH = 'DOUBLE_DASH'
}

const FEATURE_EMPTY_LINE = { 
    name: Features.EMPTY_LINE, 
    test: (line: string) => !line.trim() 
};

const FEATURE_PHONE = { 
    name: Features.PHONE, 
    test: (line: string) => phoneRegex.test(line) 
};

const FEATURE_EMAIL = { 
    name: Features.EMAIL, 
    test: (line: string) => emailRegex.test(line) 
};

const FEATURE_LINK = { 
    name: Features.LINK, 
    test: (line: string) => urlRegex.test(line) 
};

const FEATURE_LONG_LINE = { 
    name: Features.LONG_LINE, 
    test: (line: string) => line.length > maxLengthOfSignatureLine 
};

const FEATURE_FULL_NAME = {
    name: Features.FULL_NAME, 
    test: (line: string) => {
        let foundName = nlp(line).people().out('array');
        return foundName && foundName[0] == line.toLowerCase();
    }
};

const FEATURE_DOUBLE_DASH = {
    name: Features.DOUBLE_DASH, 
    test: (line: string) => {
        return line.trim() == '--';
    }
};

const FEATURE_SENTENCE = {
    name: Features.SENTENCE, 
    test: (line: string) => {
        let tokens = tokenizer.tokenize(line);
        let tokensWithoutStopWords = tokens.filter((token: string) => { return selectedStopWords.indexOf(token.toLowerCase()) < 0 });
        return tokens.length - tokensWithoutStopWords.length > 3;
    }
};

const FEATURE_CAPITAL_CASE = {
    name: Features.CAPITAL_CASE, 
    test: (line: string) => {
        let tokens: Array<string> = tokenizer.tokenize(line);
        if(tokens.length < 3) 
            return false;
        let firstLetters = tokens.map(token => token[0]).join('');
        return firstLetters.toUpperCase() == firstLetters;
    }
};

const FEATURE_NO_STOP_WORDS = {
    name: Features.NO_STOP_WORDS, 
    test: (line: string) => {
        let tokens = tokenizer.tokenize(line);
        if(tokens.length < 3) 
            return false;
        let tokensWithoutStopWords = tokens.filter((token: string) => { return selectedStopWords.indexOf(token.toLowerCase()) < 0 });
        return tokens.length == tokensWithoutStopWords.length;
    }
};



export const suppotedFeatures = [
    FEATURE_EMPTY_LINE,
    FEATURE_PHONE,
    FEATURE_EMAIL,
    FEATURE_LINK, 
    FEATURE_LONG_LINE,
    FEATURE_FULL_NAME,
    FEATURE_SENTENCE,
    FEATURE_NO_STOP_WORDS,
    FEATURE_CAPITAL_CASE,
    FEATURE_DOUBLE_DASH
]

export const detectFeaturesInText = function (lineOfText: string, language: string): Array<Features> {
    if (language && stopwords[language] != null){
        selectedStopWords = stopwords[language];
    }
    else{
        console.log('warning: No stop words are defined for language ' + language)
    }


    let detectedFeatures: Array<Features> = [];

    suppotedFeatures.forEach(feature => {
        if(feature.test(lineOfText))
            detectedFeatures.push(feature.name);
    })

    return detectedFeatures.sort();
}