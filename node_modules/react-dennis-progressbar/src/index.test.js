import React from 'react';
import ProgressBar from './index';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
let ReactDOM = require('react-dom');

Enzyme.configure({ adapter: new Adapter() });

describe('<ProgressBar/>', ()=> {
  const wrapper = shallow(
    <ProgressBar
      stepNumber={6}
      steps={[1,1,1,1]}
    />
  );

  it('Should render progress bar without props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render progress bar with props', () => {
    wrapper.setProps({
      stepNumber: 6,
      steps: [2,5,1,3,6],
      bullets: true,
      bulletColor: {
        active: 'green',
        inactive: 'gray'
      },
      lineColor: {
        active: 'blue',
        inactive: 'red'
      },
      lineHeight: 3
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render progress bar without error when stepNumber bigger that sum of arrays elements', () => {
    wrapper.setProps({
      stepNumber: 63,
      steps: [2,5,1,3,6],
      bullets: true,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('Should render progress step bar', () => {
    wrapper.setProps({
      stepNumber: 2,
      steps: [1,1,1,1,1],
    });
    expect(wrapper.exists()).toBe(true);
  });
});
