import React from 'react';

const CalcInputs = (props) => {
  return (
    <form>
      <label htmlFor="principal">Principal: $</label>
      <input
        type="text"
        name="principal"
        id="principal"
        onChange={props.handleInputsChange}
      />

      <label htmlFor="interest">Annual Rate: %</label>
      <input
        type="text"
        name="interest"
        id="interest"
        onChange={props.handleInputsChange}
      />

      <label htmlFor="compoundingPeriods">Compounding Rate (n):</label>
      <select
        name="compoundingPeriods"
        id="compoundingPeriods"
        onChange={props.handleInputsChange}
        defaultValue="1"
      >
        <option value="1">Annually</option>
        <option value="2">Bi-Annually</option>
        <option value="4">Quarterly</option>
        <option value="12">Monthly</option>
        <option value="52">Weekly</option>
        <option value="365">Daily</option>
        <option value="0">Continuously</option>
      </select>

      <label htmlFor="time">Time (in years):</label>
      <input
        type="text"
        name="time"
        id="time"
        onChange={props.handleInputsChange}
      />
    </form>
  );
};

export default CalcInputs;
