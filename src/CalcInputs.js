import React from 'react';
import './CalcInputs.css';

const CalcInputs = (props) => {
  return (
    <form>
      <div>
        <label htmlFor="principal">Initial Deposit: $</label>
        <input
          type="text"
          name="principal"
          id="principal"
          onChange={props.handleInputsChange}
        />
      </div>

      <div>
        <label htmlFor="regularDeposit">Regular Deposit: $</label>
        <input
          type="text"
          name="regularDeposit"
          id="regularDeposit"
          onChange={props.handleInputsChange}
        />
      </div>

      <div>
        <label htmlFor="depositFrequency">Deposit Frequency:</label>
        <select
          name="depositFrequency"
          id="depositFrequency"
          onChange={props.handleInputsChange}
          defaultValue="12"
        >
          <option value="1">Annually</option>
          <option value="12">Monthly</option>
          <option value="26">Fortnightly</option>
          <option value="52">Weekly</option>
          <option value="365">Daily</option>
        </select>
      </div>

      <div>
        <label htmlFor="compoundingPeriods">Compounding Frequency:</label>
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
      </div>

      <div>
        <label htmlFor="time">Time (years):</label>
        <input
          type="text"
          name="time"
          id="time"
          onChange={props.handleInputsChange}
        />
      </div>

      <div>
        <label htmlFor="interest">Annual Interest Rate: %</label>
        <input
          type="text"
          name="interest"
          id="interest"
          onChange={props.handleInputsChange}
        />
      </div>

      <div>
        <label htmlFor="annuityDue">Payment at: (of period)</label>
        <select
          name="annuityDue"
          id="annuityDue"
          onChange={props.handleInputsChange}
          defaultValue="0"
        >
          <option value="0">End (ordinary)</option>
          <option value="1">Start (due)</option>
        </select>
      </div>
    </form>
  );
};

export default CalcInputs;
