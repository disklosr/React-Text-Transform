import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {detectFeaturesInText} from './reducers/features-detector'
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

const english = 'english';
const french = 'french';
const unknownLanguage = 'zulu';


it('correctly detects english sentence', () => {
  var detected = detectFeaturesInText('Hello There! My name is Anas and I am writing some tests', english);
  expect(detected).toContain('SENTENCE');
})

it('shouldnt detects sentence in wrong language', () => {
  var detected = detectFeaturesInText('Mon nom est Anas et je suis entrain de faire des tests', unknownLanguage);
  expect(detected).toEqual([]);
})

it('shouldnt detects a french sentence', () => {
  var detected = detectFeaturesInText('Mon nom est Anas et je suis entrain de faire des tests', french);
  expect(detected).toContain('SENTENCE');
})

it('correctly detects long lines', () => {
  var detected = detectFeaturesInText('Hello There! This is a very long line that is definetly not part of a signature', french);
  expect(detected).toContain('LONG_LINE');
})


it('correctly detects phone french', () => {
  var detected = detectFeaturesInText('Hello There! My name is +33 45 56 67 78 Anas and I am writing some tests', english);
  expect(detected).toContain('PHONE');
})

it('correctly detects phone american', () => {
  var detected = detectFeaturesInText('(345) 235 4576', english);
  expect(detected).toContain('PHONE');
})

it('correctly detects full name', () => {
  var detected = detectFeaturesInText('Eric Larson Garcia', english);
  expect(detected).toContain('FULLNAME');
})

it('correctly detects email', () => {
  var detected = detectFeaturesInText('my email is pirhanas@windowslive.com of', english);
  expect(detected).toContain('EMAIL');
})

it('correctly detects web link 1', () => {
  var detected = detectFeaturesInText('www.linkedin.com/username', 'en');
  expect(detected).toContain('LINK');
})

it('correctly detects empty lines', () => {
  var detected = detectFeaturesInText('', 'en');
  expect(detected).toContain('EMPTY_LINE');
})

it('correctly detects white space lines', () => {
  var detected = detectFeaturesInText('     ', 'en');
  expect(detected).toContain('EMPTY_LINE');
})

it('correctly detects a sentence with capital case', () => {
  var detected = detectFeaturesInText('Official Revolut App', 'en');
  expect(detected).toEqual(['CAPITAL_CASE', 'NO_STOP_WORDS']);
})

it('correctly detects a sentence with no stop words', () => {
  var detected = detectFeaturesInText('Dragon Tail Talon Hailey', 'en');
  expect(detected).toContain('NO_STOP_WORDS');
})




