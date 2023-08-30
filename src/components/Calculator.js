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
    const calculateChartData = () => {
      console.log(`------------- Chart Data -------------`);

      const data = [];
      let curTotal;
      let curDeposits = 0;
      let prevTotal = inputs.principal;

      for (let i = 1; i <= inputs.time; i++) {
        console.log(`------------- Year ${i} -------------`);

        const obj = {
          name: `Year ${i}`,
          principal: inputs.principal,
        };

        // since we want the yearly values we set inputs.time = 1
        if (inputs.interest === 0) {
          curTotal =
            prevTotal + inputs.regularDeposit * inputs.depositFrequency;

          curDeposits += inputs.regularDeposit * inputs.depositFrequency;

          prevTotal = curTotal;
        } else if (inputs.depositFrequency === inputs.compoundingPeriods) {
          const principalFV =
            prevTotal *
            (1 + inputs.interest / inputs.compoundingPeriods) **
              (inputs.compoundingPeriods * 1);

          console.log('principalFV', principalFV);

          const annuityFV =
            inputs.regularDeposit *
            (((1 + inputs.interest / inputs.compoundingPeriods) **
              (inputs.compoundingPeriods * 1) -
              1) /
              (inputs.interest / inputs.compoundingPeriods)) *
            (1 +
              (inputs.interest / inputs.compoundingPeriods) *
                inputs.annuityDue);

          console.log('annuityFV', annuityFV);

          curTotal = principalFV + annuityFV;

          curDeposits += inputs.regularDeposit * inputs.depositFrequency;

          prevTotal = curTotal;
        } else if (inputs.compoundingPeriods === 0) {
          const principalFV = prevTotal * Math.E ** (inputs.interest * 1);

          console.log('principalFV', principalFV);

          const annuityFV =
            (inputs.regularDeposit /
              (Math.E ** (inputs.interest / inputs.depositFrequency) - 1)) *
            (Math.E **
              ((inputs.interest / inputs.depositFrequency) *
                (1 * inputs.depositFrequency)) -
              1) *
            (1 +
              (Math.E ** (inputs.interest / inputs.depositFrequency) - 1) *
                inputs.annuityDue);

          console.log('annuityFV', annuityFV);

          curTotal = principalFV + annuityFV;

          curDeposits += inputs.regularDeposit * inputs.depositFrequency;

          prevTotal = curTotal;
        } else {
          const principalFV =
            prevTotal *
            (1 + inputs.interest / inputs.compoundingPeriods) **
              (inputs.compoundingPeriods * 1);

          console.log('principalFV', principalFV);

          const equivalentInterestRate =
            inputs.depositFrequency *
            ((1 + inputs.interest / inputs.compoundingPeriods) **
              (inputs.compoundingPeriods / inputs.depositFrequency) -
              1);

          let annuityFV =
            inputs.regularDeposit *
            (((1 + equivalentInterestRate / inputs.depositFrequency) **
              (inputs.depositFrequency * 1) -
              1) /
              (equivalentInterestRate / inputs.depositFrequency)) *
            (1 +
              (equivalentInterestRate / inputs.depositFrequency) *
                inputs.annuityDue);

          console.log('annuityFV', annuityFV);

          curTotal = principalFV + annuityFV;

          curDeposits += inputs.regularDeposit * inputs.depositFrequency;

          prevTotal = curTotal;
        }

        console.log('curTotal', curTotal);
        console.log('inputs.principal', inputs.principal);
        console.log('curDeposits', curDeposits);

        obj.interest = curTotal - curDeposits - inputs.principal;
        obj.deposits = curDeposits;
        obj.total = curTotal;

        console.log('chart data', obj);

        data.push(obj);
      }

      setChartData(data);
      console.log(`------------- End Chart Data -------------`);
    };

    const calculateButton = document.querySelector('button');
    calculateButton.addEventListener('click', calculateChartData);

    return () => {
      calculateButton.removeEventListener('click', calculateChartData);
    };
  });

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
