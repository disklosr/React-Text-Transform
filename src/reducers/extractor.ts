let natural = require('natural');
let languageDetector = new(require('languagedetect'));
let nlp = require('compromise')

let tokenizer = new natural.WordTokenizer();

const stopwords = {
    french:  require('./stopwords-fr.json'),
    english: require('./stopwords-en.json')
}

let selectedStopWords = stopwords.english;


const defaultLanguage = 'english';

//let phoneRegex = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]\\d{2,})+","g");
const phoneRegex = /\+?\(?\d*\)? ?\(?\d+\)?\d*([\s.\-]\d{2,})+/g;
const emailRegex = /\b[a-z0-9-_.]+@[a-z0-9-_.]+(\.[a-z0-9]+)+/i;
const urlRegex   = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/gi

const maxLengthOfSignatureLine = 60;

// Additive scores affected to lines. The higher the score the higher the chance the line is a part of email signature
const definetlyNotASignatureLine = -10;
const startOfSignatureScore = -50;
const phoneNumberScore = 5;
const onlyAUrlScore = 5;
const authorsNameScore = 10;
const emailAddressScore = 5;
const emptyLineScore = 1;
const noStopWordsScore = 2
const neutralScore = 0;


//Rules to calculate the score of each line

/** Checks if line contains an email */
const rule_containsEmail = function(line: string): number{
    if(emailRegex.test(line))
        return emailAddressScore;

    return neutralScore;
}

/** Checks whether this line contains only a person's name using nlp analysis */
const rule_isNameOfPerson = function(line: string): number{
    let foundName = nlp(line).people().out('array');
    if(foundName && foundName[0] == line.toLowerCase())
        return authorsNameScore;

    return neutralScore;
}

/** Checks whether this line contains only a url*/
const rule_isUrl = function(line: string): number{
    let matchedUrl = urlRegex.exec(line)
    if(matchedUrl != null && matchedUrl[0] == line)
        return onlyAUrlScore;

    return neutralScore;
}

/** Checks whether this line contains the double dash '--' used to mark begginging of signature */
const rule_startOfSignatureDoubleDash = function(line: string): number{
    if(line.trim() == '--')
        return startOfSignatureScore;

    return neutralScore;
}

/** Checks whether line has more than 60 chars */
const rule_longLine = function(line: string): number{
    if(line.length > maxLengthOfSignatureLine)
        return definetlyNotASignatureLine;

    return neutralScore;
}

/** Checks if line is empty */
const rule_emptyLine = function(line: string): number{
    if(!line)
        return emptyLineScore;

    return neutralScore;
}

/** Checks if line contains a phone number */
const rule_containsPhoneNumber = function(line: string): number{
    if(phoneRegex.test(line))
        return phoneNumberScore;

    return neutralScore;
}

/** Checks if line contains an address */
const rule_containsAddress = function(line: string): number{
    return neutralScore;
}

/** The more stop words a line contains, the less likely it is a part of a mail signature */
const rule_containsFewStopWords = function(line: string): number{
    let tokens = tokenizer.tokenize(line);
    let tokensWithoutStopWords = tokens.filter((token: string)=> { return selectedStopWords.indexOf(token.toLowerCase()) < 0 })

    if(tokens.length - tokensWithoutStopWords.length > 3)
        return definetlyNotASignatureLine;

    if(tokens.length > 1 && tokens.length == tokensWithoutStopWords.length)
        return noStopWordsScore;

    return neutralScore;
}

const rules = [
    rule_startOfSignatureDoubleDash,
    rule_longLine,
    rule_containsAddress,
    rule_containsEmail,
    rule_isNameOfPerson,
    rule_containsPhoneNumber,
    rule_containsFewStopWords,
    rule_isUrl,
    rule_emptyLine
]


/** Main routine to calculate score of each line using rules */
const calculateLineScore = function(line: string): number{
    let lineScore = rules.map(rule => rule(line)).reduce((a,b) => a + b, 0);
    return lineScore == 0 ? -1 : lineScore;
}

/** Calculates sum of subarray elements given a start and end indices */
const sumOfSub = function(array: Array<number>, start: number, end: number): number{
    let sum = 0;
    for(let i = start; i < end; i++){
        sum += array[i];
    }
    return sum;
}


/** A js implementation of Kadane's algorithm to find max sum of contiguous subarray within a given array */
export const findMaxSumOfContiguousSubArray = function optimalSolution(arrIntegers: Array<number>): {startIndex: number, endIndex: number}{
    
    let max = 0,
        result = {startIndex: -1, endIndex: -1 };
    
    console.log("Array received: " + arrIntegers)
    
    if (arrIntegers.length === 0) {
        return result;
    }
    
    result.startIndex = result.endIndex = 0;

    console.log(arrIntegers)

    for (let i = 1; i < arrIntegers.length; i++) {
       for(let j = 0; j < arrIntegers.length - i + 1; j++){
           let potentialMax = sumOfSub(arrIntegers, j, j + i)
           if(potentialMax > max){
               max = potentialMax;
               result.startIndex = j;
               result.endIndex = i + j - 1;
           }
       }
    }
    console.log({sum: max, start: result.startIndex, end: result.endIndex});
    return result;
}

const setStopWordsForLanguage = function(text: string): object{
    let detectionResults = languageDetector.detect(text);
    let foundLanguage;

    console.log(detectionResults.slice(0,2));

    if((foundLanguage = detectionResults[0][0]) in stopwords)
        return stopwords[foundLanguage];

    if((foundLanguage = detectionResults[0][1]) in stopwords)
        return stopwords[foundLanguage];

    return stopwords[defaultLanguage];
}


/** Extracts a possible signature block from an arbitrary text block */ 
export default function extract(text: string): Array<string>{
    setStopWordsForLanguage(text);

    text = text.replace(/(^[ \t]*\n){2,}/gm, "\n");
    let scorePerLineArray = text.split("\n").map(line => calculateLineScore(line));
    let {startIndex, endIndex} = findMaxSumOfContiguousSubArray(scorePerLineArray);
    return text.split("\n").slice(startIndex, endIndex + 1)
}







