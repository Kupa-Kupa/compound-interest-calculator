/*
  using this exported function in the Calculator component useEffect hook
  causes a massive slowdown in the rendering of the charts
*/

// pass set function as a parameter so I can call it at the end
function calculateChartData(inputs, setChartData) {
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
      curTotal = prevTotal + inputs.regularDeposit * inputs.depositFrequency;

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
        (1 + (inputs.interest / inputs.compoundingPeriods) * inputs.annuityDue);

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

  // console.log(`------------- End Chart Data -------------`);

  // return data;
}

export { calculateChartData };
