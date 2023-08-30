// https://redixhumayun.github.io/visualization/2019/06/08/a-visual-reference-for-d3.html

import React from 'react';
import { formatNumber } from '../utils/utils';
import './Charts.css';

import {
  BarChart,
  Bar,
  // Cell,
  XAxis,
  YAxis,
  // Label,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Charts = (props) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="label">
            {`Principal: ${formatNumber(payload[0].payload.principal)}`}
          </p>
          <p className="label">
            {`Deposits: ${formatNumber(payload[0].payload.deposits)}`}
          </p>
          <p className="label">
            {`Interest: ${formatNumber(payload[0].payload.interest)}`}
          </p>
          <p className="label">
            {`Total: ${formatNumber(payload[0].payload.total)}`}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="chart-container">
      <div className="responsive-container-parent">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={props.data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'AUD',
                  currencyDisplay: 'narrowSymbol',
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value);
              }}
              label={{
                value: 'Total $',
                position: 'insideLeft',
                angle: -90,
                dy: -20,
                dx: -10,
                className: 'y-axis-label',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="principal" stackId="a" fill="rgb(1,70,245)" />
            <Bar dataKey="deposits" stackId="a" fill="rgb(30, 161, 161)" />
            <Bar dataKey="interest" stackId="a" fill="rgb(166, 190, 252)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
