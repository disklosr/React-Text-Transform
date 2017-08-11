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

console.log(urlRegex);


const FEATURE_EMPTYLINE = { name: 'EMPTY_LINE', test: (line: string) => !line.trim() };

const FEATURE_PHONE = { name: 'PHONE', test: (line: string) => phoneRegex.test(line) };

const FEATURE_EMAIL = { name: 'EMAIL', test: (line: string) => emailRegex.test(line) };

const FEATURE_LINK = { name: 'LINK', test: (line: string) => urlRegex.test(line) };

const FEATURE_LONG_LINE = { name: 'LONG_LINE', test: (line: string) => line.length > maxLengthOfSignatureLine };

const FEATURE_FULLNAME = {
    name: 'FULLNAME', test: (line: string) => {
        let foundName = nlp(line).people().out('array');
        return foundName && foundName[0] == line.toLowerCase();
    }
};

const FEATURE_SENTENCE = {
    name: 'SENTENCE', test: (line: string) => {
        let tokens = tokenizer.tokenize(line);
        let tokensWithoutStopWords = tokens.filter((token: string) => { return selectedStopWords.indexOf(token.toLowerCase()) < 0 });
        return tokens.length - tokensWithoutStopWords.length > 3;
    }
};

const FEATURE_CAPITAL_CASE = {
    name: 'CAPITAL_CASE', test: (line: string) => {
        let tokens: Array<string> = tokenizer.tokenize(line);
        let firstLetters = tokens.map(token => token[0]).join('');
        return firstLetters.toUpperCase() == firstLetters;
    }
};

const FEATURE_NO_STOP_WORDS = {
    name: 'NO_STOP_WORDS', test: (line: string) => {
        let tokens = tokenizer.tokenize(line);
        let tokensWithoutStopWords = tokens.filter((token: string) => { return selectedStopWords.indexOf(token.toLowerCase()) < 0 });
        return tokens.length == tokensWithoutStopWords.length;
    }
};

export const features = [
    FEATURE_EMPTYLINE,
    FEATURE_PHONE,
    FEATURE_EMAIL,
    FEATURE_LINK, 
    FEATURE_LONG_LINE,
    FEATURE_FULLNAME,
    FEATURE_SENTENCE,
    FEATURE_NO_STOP_WORDS,
    FEATURE_CAPITAL_CASE
]

export const detectFeaturesInText = function (lineOfText: string, language: string): Array<string> {
    if (language && stopwords[language] != null)
        selectedStopWords = stopwords[language];

    let detectedFeatures: Array<string> = [];

    features.forEach(feature => {
        if(feature.test(lineOfText))
            detectedFeatures.push(feature.name);
    })

    return detectedFeatures.sort();
}