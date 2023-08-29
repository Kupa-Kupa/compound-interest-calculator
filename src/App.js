import React, { useState } from 'react';
import Calculator from './components/Calculator';
import Charts from './components/Charts';
import './App.css';
import { dummyData } from './data/dummyData';

function App() {
  const [data, setData] = useState(dummyData);

  return (
    <main>
      <Charts data={data} />
      <Calculator setData={setData} />
    </main>
  );
}

export default App;
