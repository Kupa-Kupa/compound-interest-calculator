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

function calculatePeriodicallyCompounding(inputs) {
  console.log(`------------- Periodically Compounding -------------`);

  const FV =
    inputs.principal *
    (1 + inputs.interest / inputs.compoundingPeriods) **
      (inputs.compoundingPeriods * inputs.time);

  console.log('Periodically Compounding FV', FV);

  return FV;
}

function calculateContinuouslyCompounding(inputs) {
  console.log(`------------- Continuously Compounding -------------`);

  const FV = inputs.principal * Math.E ** (inputs.interest * inputs.time);

  console.log('Continuously Compounding FV', FV);

  return FV;
}

function calculateDepositCompounding(inputs) {
  console.log(`------------- Deposit Periodically Compounding -------------`);

  const FV =
    calculatePeriodicallyCompounding(inputs) + calculateAnnuity(inputs);

  console.log('Total', FV);

  return FV;
}

function calculateDepositContinuouslyCompounding(inputs) {
  console.log(`------------- Deposit Continuously Compounding -------------`);

  const FV =
    calculateContinuouslyCompounding(inputs) + calculateAnnuity(inputs);

  console.log('Total', FV);

  return FV;
}

// https://www.investopedia.com/terms/f/future-value-annuity.asp
// better formula explanation
// https://www.calculatorsoup.com/calculators/financial/future-value-annuity-calculator.php
function calculateAnnuity(inputs) {
  console.log('inputs.regularDeposit', inputs.regularDeposit);
  console.log('inputs.depositFrequency', inputs.depositFrequency);
  console.log('inputs.compoundingPeriods', inputs.compoundingPeriods);
  console.log('inputs.interest', inputs.interest);
  console.log('inputs.time', inputs.time);
  console.log('inputs.annuityDue', inputs.annuityDue);

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
    console.log(`continuously compounding annuity`);

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

    // must use depositFrequency NOT compoundingPeriods
    let FV =
      inputs.regularDeposit *
      (((1 + equivalentInterestRate / inputs.depositFrequency) **
        (inputs.depositFrequency * inputs.time) -
        1) /
        (equivalentInterestRate / inputs.depositFrequency)) *
      (1 +
        (equivalentInterestRate / inputs.depositFrequency) * inputs.annuityDue);

    console.log('Annuity FV', FV);

    if (isNaN(FV)) {
      FV = 0;
    }

    return FV;
  }
}

export {
  calculateDepositContinuouslyCompounding,
  calculateDepositCompounding,
  calculateContinuouslyCompounding,
  calculatePeriodicallyCompounding,
};

/*---------- Unused Formulas ----------*/

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
