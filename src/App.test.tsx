import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {findMaxSumOfContiguousSubArray} from './reducers/extractor'
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

test('the best flavor is grapefruit', () => {
  expect(findMaxSumOfContiguousSubArray([1,1,1,1,-1,1,1,1])).toBe({startIndex: 0, endIndex: 0});
});