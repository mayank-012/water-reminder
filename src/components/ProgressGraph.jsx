
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../css/ProgressGraph.css'; 


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressGraph = ({ chartData }) => {
  return (
    <div className="progress-graph">
      <h2>Water Intake Over the Last 10 Days</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ProgressGraph;
