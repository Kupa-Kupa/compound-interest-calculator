import React, { useState, useEffect } from 'react';
import CalcInputs from './CalcInputs';
import './Calculator.css';
import { formatNumber } from '../utils/utils';
import {
  calculateContinuouslyCompounding,
  calculateDepositCompounding,
  calculateDepositContinuouslyCompounding,
  calculatePeriodicallyCompounding,
} from '../utils/formulas';
import { calculateChartData } from '../utils/calculateChartData';

const Calculator = (props) => {
  const { setChartData } = props;

  const [inputs, setInputs] = useState({
    principal: 1000,
    interest: 0.05,
    compoundingPeriods: 1,
    time: 5,
    regularDeposit: 100,
    depositFrequency: 12,
    annuityDue: 0,
  });

  const [accruedAmount, setAccruedAmount] = useState(0);

  const handleInputs = (e) => {
    let { name, value } = e.target;

    // validate inputs
    if (
      name === 'principal' ||
      name === 'regularDeposit' ||
      name === 'interest'
    ) {
      if (!value) {
        value = 0;
        e.target.placeholder = 0;
      } else if (value.match(/.*\..*\..*/)) {
        e.target.value = value.slice(0, -1);
        value = value.slice(0, -1);
      } else if (isNaN(value) || value < 0) {
        e.target.value = 0;
        value = 0;
      }
    }

    // need to validate time to be an int (no partial years)
    if (name === 'time') {
      // if the value is deleted then I want value and placeholder to be 1
      if (!value) {
        value = 1;
        e.target.placeholder = 1;
      } else if (isNaN(value) || value < 1 || value % 1 !== 0) {
        e.target.value = parseInt(value) || 1;
        value = parseInt(value) || 1;
      }
    }

    if (name === 'interest') {
      value = value / 100;
    }

    console.log('Input Changed:', name);
    console.log(`New ${name} value:`, Number(value));

    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: Number(value),
      };
    });
  };

  // Calculate FV
  const calculate = () => {
    let FV = 0;

    if (inputs.regularDeposit !== 0 && inputs.compoundingPeriods === 0) {
      FV = calculateDepositContinuouslyCompounding(inputs);
    } else if (inputs.regularDeposit !== 0) {
      FV = calculateDepositCompounding(inputs);
    } else if (inputs.compoundingPeriods === 0) {
      FV = calculateContinuouslyCompounding(inputs);
    } else {
      FV = calculatePeriodicallyCompounding(inputs);
    }

    setAccruedAmount((prevState) => {
      return FV;
    });
  };

  // update chart data when calculate button clicked
  useEffect(() => {
    const calculateButton = document.querySelector('button');

    const renderChartData = () => {
      calculateChartData(inputs, setChartData);
    };

    calculateButton.addEventListener('click', renderChartData);

    return () => {
      calculateButton.removeEventListener('click', renderChartData);
    };
  });

  /*
    calculateButton.removeEventListener('click', () => {
      calculateChartData(inputs, setChartData);
    });

    I was failing to remove the event listener above.

    This is because the removeEventListener method requires you to pass 
    the exact same function reference that you used when adding the event 
    listener. 

    I was passing an anonymous arrow function when adding 
    the event listener, and then trying to remove a different 
    anonymous arrow function. Since these are different function 
    references, the removeEventListener wasn't working.

    I had to define the event listener function separately as:

    const renderChartData = () => {
      calculateChartData(inputs, setChartData);
    };

    Then I could remove it since the function reference was the same.
  */

  // return calculator component
  return (
    <div className="calculator-container">
      <CalcInputs handleInputsChange={handleInputs} />
      <div className="output-container">
        <div>{formatNumber(accruedAmount)}</div>
        <button onClick={calculate}>Calculate</button>
      </div>
    </div>
  );
};

export default Calculator;
