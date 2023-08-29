import React, { useState } from 'react';
import Calculator from './components/Calculator';
import Charts from './components/Charts';
import './App.css';
import { dummyData } from './data/dummyData';
import Header from './components/Header';

function App() {
  const [data, setData] = useState(dummyData);

  return (
    <main>
      <Header />
      <Charts data={data} />
      <Calculator setData={setData} />
    </main>
  );
}

export default App;
