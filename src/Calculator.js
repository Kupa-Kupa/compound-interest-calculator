/*
    A = P(1 + r/n)nt

    In the formula

    A = Accrued amount (principal + interest)
    P = Principal amount
    r = Annual nominal interest rate as a decimal
    R = Annual nominal interest rate as a percent
    r = R/100
    n = number of compounding periods per unit of time
    t = time in decimal years; e.g., 6 months is calculated as 0.5 years.
        Divide your partial year number of months by 12 to get the decimal 
        years.
    I = Interest amount
    ln = natural logarithm, used in formulas below
*/

import React, { useState, useEffect } from 'react';
import CalcInputs from './CalcInputs';
import './Calculator.css';

const Calculator = (props) => {
  const [inputs, setInputs] = useState({
    principal: 0,
    interest: 0,
    compoundingPeriods: 1,
    time: 0,
  });

  const [accruedAmount, setAccruedAmount] = useState(0);

  const handleInputs = (e) => {
    let { name, value } = e.target;

    if (name === 'interest') {
      value = value / 100;
    }

    console.log('name', name);
    console.log('value', value);

    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const calculate = () => {
    console.log('compoundingPeriods', inputs.compoundingPeriods);
    if (inputs.compoundingPeriods === '0') {
      setAccruedAmount((prevState) => {
        const amount =
          inputs.principal * Math.E ** (inputs.interest * inputs.time);

        console.log('amount', amount);
        return amount.toFixed(2);
      });
    } else {
      setAccruedAmount((prevState) => {
        const amount =
          inputs.principal *
          (1 + inputs.interest / inputs.compoundingPeriods) **
            (inputs.compoundingPeriods * inputs.time);

        return amount.toFixed(2);
      });
    }
  };

  useEffect(() => {
    const calculateChartData = () => {
      const data = [];
      let curTotal;
      let prevTotal = inputs.principal;

      for (let i = 1; i <= inputs.time; i++) {
        const obj = {
          name: `Year ${i}`,
          principal: inputs.principal,
        };

        if (inputs.compoundingPeriods === '0') {
          curTotal = prevTotal * Math.E ** (inputs.interest * 1);

          prevTotal = curTotal;
        } else {
          curTotal =
            prevTotal *
            (1 + inputs.interest / inputs.compoundingPeriods) **
              (inputs.compoundingPeriods * 1);

          prevTotal = curTotal;
        }

        obj.interest = (curTotal - inputs.principal).toFixed(2);
        obj.total = curTotal.toFixed(2);

        console.log('chart obj', obj);

        data.push(obj);
      }

      props.setData(data);
    };

    const calculateButton = document.querySelector('button');

    calculateButton.addEventListener('click', calculateChartData);

    return () => {
      calculateButton.removeEventListener('click', calculateChartData);
    };
    // }, [accruedAmount]);
  });

  return (
    <div className="calculator-container">
      <CalcInputs handleInputsChange={handleInputs} />
      <div className="output-container">
        <div>{accruedAmount}</div>
        <button onClick={calculate}>Calculate</button>
      </div>
    </div>
  );
};

export default Calculator;
