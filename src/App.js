import React, { useState } from 'react';
import Calculator from './Calculator';
import Charts from './Charts';
import './App.css';

function App() {
  const [data, setData] = useState([
    {
      name: 'Year 1',
      principal: '1000',
      interest: '50.00',
      total: '1050.00',
    },
    {
      name: 'Year 2',
      principal: '1000',
      interest: '102.50',
      total: '1102.50',
    },
    {
      name: 'Year 3',
      principal: '1000',
      interest: '157.63',
      total: '1157.63',
    },
    {
      name: 'Year 4',
      principal: '1000',
      interest: '215.51',
      total: '1215.51',
    },
    {
      name: 'Year 5',
      principal: '1000',
      interest: '276.28',
      total: '1276.28',
    },
    {
      name: 'Year 6',
      principal: '1000',
      interest: '340.10',
      total: '1340.10',
    },
    {
      name: 'Year 7',
      principal: '1000',
      interest: '407.10',
      total: '1407.10',
    },
    {
      name: 'Year 8',
      principal: '1000',
      interest: '477.46',
      total: '1477.46',
    },
    {
      name: 'Year 9',
      principal: '1000',
      interest: '551.33',
      total: '1551.33',
    },
    {
      name: 'Year 10',
      principal: '1000',
      interest: '628.89',
      total: '1628.89',
    },
  ]);

  return (
    <div>
      <Charts data={data} />
      <Calculator setData={setData} />
    </div>
  );
}

export default App;
