import React, { useState } from 'react';
import Calculator from './components/Calculator';
import Charts from './components/Charts';
import './App.css';
import { dummyData } from './data/dummyData';
import Header from './components/Header';

function App() {
  const [chartData, setChartData] = useState(dummyData);

  return (
    <main>
      <Header />
      <Charts chartData={chartData} />
      <Calculator setChartData={setChartData} />
    </main>
  );
}

export default App;
