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
    // principal: 0,
    // interest: 0,
    // compoundingPeriods: 1,
    // time: 1,
    // regularDeposit: 0,
    // depositFrequency: 12,
    // annuityDue: 0,
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
      if (value.match(/.*\..*\..*/)) {
        e.target.value = value.slice(0, -1);
        value = value.slice(0, -1);
      } else if (isNaN(value) || value < 0) {
        e.target.value = 0;
        value = 0;
      }
    }

    // need to validate time to be an int (no partial years)
    // this places a leading 0 which can't be backspaced away
    // which is kind of annoying
    if (name === 'time') {
      if (!value) {
        // e.target.value = 1;
        value = 1;
      } else if (isNaN(value) || value < 1 || value % 1 !== 0) {
        e.target.value = parseInt(value) || 1;
        value = parseInt(value) || 1;
      }
    }

    if (name === 'interest') {
      value = value / 100;
    }

    console.log('name', name);
    console.log('value', Number(value));

    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: Number(value),
      };
    });
  };

  const calculate = () => {
    console.log('compoundingPeriods', inputs.compoundingPeriods);

    console.log('regularDeposit', inputs.regularDeposit);

    if (inputs.regularDeposit !== 0 && inputs.compoundingPeriods === 0) {
      console.log('deposits made');
      calculateDepositContinuouslyCompounding();
    } else if (inputs.regularDeposit !== 0) {
      console.log('deposits made');
      calculateDepositCompounding();
    } else if (inputs.compoundingPeriods === 0) {
      calculateContinuouslyCompounding();
    } else {
      calculatePeriodicallyCompounding();
    }

    // calculateDepositCompounding();
  };

  const calculatePeriodicallyCompounding = () => {
    // setAccruedAmount((prevState) => {
    //   const FV =
    //     inputs.principal *
    //     (1 + inputs.interest / inputs.compoundingPeriods) **
    //       (inputs.compoundingPeriods * inputs.time);
    //   return FV;
    // });

    const FV =
      inputs.principal *
      (1 + inputs.interest / inputs.compoundingPeriods) **
        (inputs.compoundingPeriods * inputs.time);

    setAccruedAmount((prevState) => {
      return FV;
    });

    console.log('periodically compounding FV', FV);

    return FV;
  };

  const calculateContinuouslyCompounding = () => {
    // setAccruedAmount((prevState) => {
    //   const FV = inputs.principal * Math.E ** (inputs.interest * inputs.time);
    //   console.log('amount', FV);
    //   return FV;
    // });

    const FV = inputs.principal * Math.E ** (inputs.interest * inputs.time);
    console.log('amount', FV);

    setAccruedAmount((prevState) => {
      return FV;
    });

    return FV;
  };

  const calculateDepositCompounding = () => {
    // setAccruedAmount((prevState) => {
    //   const FV = calculatePeriodicallyCompounding() + calculateAnnuity();
    //   console.log('amount', FV);
    //   return FV;
    // });

    const FV = calculatePeriodicallyCompounding() + calculateAnnuity();

    console.log('annuity', calculateAnnuity());

    console.log('Total', FV);

    setAccruedAmount((prevState) => {
      return FV;
    });

    return FV;
  };

  const calculateDepositContinuouslyCompounding = () => {
    // setAccruedAmount((prevState) => {
    //   const FV = calculatePeriodicallyCompounding() + calculateAnnuity();
    //   console.log('amount', FV);
    //   return FV;
    // });

    const FV = calculateContinuouslyCompounding() + calculateAnnuity();

    // console.log('annuity', calculateAnnuity());

    // console.log('Total', FV);

    setAccruedAmount((prevState) => {
      return FV;
    });

    return FV;
  };

  // https://www.investopedia.com/terms/f/future-value-annuity.asp
  // better formula explanation
  // https://www.calculatorsoup.com/calculators/financial/future-value-annuity-calculator.php
  const calculateAnnuity = () => {
    console.log('inputs.regularDeposit', inputs.regularDeposit);
    console.log('inputs.interest', inputs.interest);
    console.log('inputs.depositFrequency', inputs.depositFrequency);
    console.log('inputs.time', inputs.time);

    if (inputs.interest === 0) {
      console.log('no interest');
      const FV = inputs.regularDeposit * inputs.depositFrequency * inputs.time;

      return FV;
    } else if (inputs.depositFrequency === inputs.compoundingPeriods) {
      const FV =
        inputs.regularDeposit *
        (((1 + inputs.interest / inputs.compoundingPeriods) **
          (inputs.compoundingPeriods * inputs.time) -
          1) /
          (inputs.interest / inputs.compoundingPeriods)) *
        (1 + (inputs.interest / inputs.compoundingPeriods) * inputs.annuityDue);

      console.log('Annuity FV', FV);

      return FV;
    } else if (inputs.compoundingPeriods === 0) {
      // https://www.calculatorsoup.com/calculators/financial/future-value-calculator.php
      // effective rate becomes e^r -1
      console.log(`continuous`);

      // interest rate must be in terms of deposit frequency

      const FV =
        (inputs.regularDeposit /
          (Math.E ** (inputs.interest / inputs.depositFrequency) - 1)) *
        (Math.E **
          ((inputs.interest / inputs.depositFrequency) *
            (inputs.time * inputs.depositFrequency)) -
          1) *
        (1 +
          (Math.E ** (inputs.interest / inputs.depositFrequency) - 1) *
            inputs.annuityDue);

      // const FV =
      //   (inputs.regularDeposit / (Math.E ** effectiveRate - 1)) *
      //   (Math.E ** (effectiveRate * inputs.time) - 1) *
      //   (1 + (Math.E ** effectiveRate - 1) * inputs.annuityDue);

      console.log('Annuity FV', FV);

      return FV;
    } else {
      const equivalentInterestRate =
        inputs.depositFrequency *
        ((1 + inputs.interest / inputs.compoundingPeriods) **
          (inputs.compoundingPeriods / inputs.depositFrequency) -
          1);

      console.log('equivalentInterestRate', equivalentInterestRate);

      // const FV =
      //   inputs.regularDeposit *
      //   (((1 + equivalentInterestRate / inputs.compoundingPeriods) **
      //     (inputs.compoundingPeriods * inputs.time) -
      //     1) /
      //     (equivalentInterestRate / inputs.compoundingPeriods)) *
      //   (1 +
      //     (equivalentInterestRate / inputs.compoundingPeriods) *
      //       inputs.annuityDue);

      let FV =
        inputs.regularDeposit *
        (((1 + equivalentInterestRate / inputs.depositFrequency) **
          (inputs.depositFrequency * inputs.time) -
          1) /
          (equivalentInterestRate / inputs.depositFrequency)) *
        (1 +
          (equivalentInterestRate / inputs.depositFrequency) *
            inputs.annuityDue);

      console.log('Annuity FV', FV);

      if (isNaN(FV)) {
        FV = 0;
      }

      return FV;
    }
  };

  // this is not really necessary can do it in a single annuity formula
  // by adding * (1 + rT)
  // https://www.calculatorsoup.com/calculators/financial/future-value-annuity-calculator.php
  /*
  const calculateAnnuityDue = () => {
    const FV =
      inputs.regularDeposit *
      (((1 + inputs.interest / inputs.compoundingPeriods) **
        (inputs.compoundingPeriods * inputs.time) -
        1) /
        (inputs.interest / inputs.compoundingPeriods)) *
      (inputs.interest / inputs.compoundingPeriods);

    return FV;
  };
  */

  // set chart data
  useEffect(() => {
    const calculateChartData = () => {
      const data = [];
      let curTotal;
      let curDeposits = 0;
      let prevTotal = inputs.principal;

      /*
        principal: 0,
        interest: 0,
        compoundingPeriods: 1,
        time: 0,
        regularDeposit: 0,
        depositFrequency: 12,
        annuityDue: 0,
      */

      for (let i = 1; i <= inputs.time; i++) {
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

          const annuityFV =
            inputs.regularDeposit *
            (((1 + inputs.interest / inputs.compoundingPeriods) **
              (inputs.compoundingPeriods * 1) -
              1) /
              (inputs.interest / inputs.compoundingPeriods)) *
            (1 +
              (inputs.interest / inputs.compoundingPeriods) *
                inputs.annuityDue);

          curTotal = principalFV + annuityFV;

          curDeposits += inputs.regularDeposit * inputs.depositFrequency;

          prevTotal = curTotal;
        } else if (inputs.compoundingPeriods === 0) {
          console.log('--------------------------');
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

          curTotal = principalFV + annuityFV;

          curDeposits += inputs.regularDeposit * inputs.depositFrequency;

          prevTotal = curTotal;
        }

        ///////
        console.log('curTotal', curTotal);
        console.log('curDeposits', curDeposits);
        console.log('inputs.principal', inputs.principal);
        obj.interest = (curTotal - curDeposits - inputs.principal).toFixed(2);
        obj.deposits = curDeposits.toFixed(2);
        obj.total = curTotal.toFixed(2);

        console.log('chart obj', obj);

        data.push(obj);
      }

      props.setData(data);
    };

    // const validateInput = (e) => {
    //   let { name, value } = e.target;

    //   if (
    //     name === 'principal' ||
    //     name === 'regularDeposit' ||
    //     name === 'time' ||
    //     name === 'interest'
    //   ) {
    //     if (isNaN(value) || value < 0) {
    //       e.target.value = 0;
    //     }
    //   }
    // };

    const calculateButton = document.querySelector('button');
    calculateButton.addEventListener('click', calculateChartData);

    // const principalInput = document.querySelector('#principal');
    // principalInput.addEventListener('change', validateInput);

    // const regularDepositInput = document.querySelector('#regularDeposit');
    // regularDepositInput.addEventListener('change', validateInput);

    // const timeInput = document.querySelector('#time');
    // timeInput.addEventListener('change', validateInput);

    // const interestInput = document.querySelector('#interest');
    // interestInput.addEventListener('change', validateInput);

    return () => {
      calculateButton.removeEventListener('click', calculateChartData);

      // principalInput.removeEventListener('change', validateInput);

      // regularDepositInput.removeEventListener('change', validateInput);

      // timeInput.removeEventListener('change', validateInput);

      // interestInput.removeEventListener('change', validateInput);
    };
    // }, [accruedAmount]);
  });

  return (
    <div className="calculator-container">
      <CalcInputs handleInputsChange={handleInputs} />
      <div className="output-container">
        <div>
          {accruedAmount.toLocaleString(undefined, {
            style: 'currency',
            currency: 'AUD',
            currencyDisplay: 'narrowSymbol',
            maximumFractionDigits: 2,
          })}
        </div>
        <button onClick={calculate}>Calculate</button>
      </div>
    </div>
  );
};

export default Calculator;
