import React, { useState, useEffect, useCallback, useRef } from 'react';
/*---------- Import Components ----------*/
import CalcInputs from './CalcInputs';
/*---------- Import Functions ----------*/
import { formatNumber } from '../utils/utils';
import {
  calculateContinuouslyCompounding,
  calculateDepositCompounding,
  calculateDepositContinuouslyCompounding,
  calculatePeriodicallyCompounding,
} from '../utils/formulas';
import { calculateChartData } from '../utils/calculateChartData';
/*---------- Import CSS ----------*/
import './Calculator.css';

const Calculator = (props) => {
  const { setChartData } = props;

  const [accruedAmount, setAccruedAmount] = useState(0);

  const [inputs, setInputs] = useState({
    principal: 1000,
    interest: 0.05,
    compoundingPeriods: 1,
    time: 5,
    regularDeposit: 100,
    depositFrequency: 12,
    annuityDue: 0,
  });

  const handleInputs = (e) => {
    let { name, value } = e.target;

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

  const calculateFV = () => {
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

    // set accrued amount to display on page
    setAccruedAmount(FV);
  };

  const calculateButtonRef = useRef(null);

  const renderChartData = useCallback(() => {
    calculateChartData(inputs, setChartData);
  }, [inputs, setChartData]);

  useEffect(() => {
    // add event listener to calculate button
    calculateButtonRef.current?.addEventListener('click', renderChartData);

    const currentButtonRef = calculateButtonRef.current;

    return () => {
      currentButtonRef?.removeEventListener('click', renderChartData);
    };
  }, [renderChartData]);

  return (
    <div className="calculator-container">
      <CalcInputs handleInputsChange={handleInputs} />
      <div className="output-container">
        <div>{formatNumber(accruedAmount)}</div>
        <button ref={calculateButtonRef} onClick={calculateFV}>
          Calculate
        </button>
      </div>
    </div>
  );
};

export default Calculator;
