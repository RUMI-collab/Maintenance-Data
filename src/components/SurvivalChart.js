import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SurvivalChart = ({ dataLogs, isGlobal, allSites }) => {
    const labels = ['Week 2', 'Week 4', 'Week 6', 'Week 8', 'Week 12'];
    
    // Filter data to only show points that have values (not empty or 0)
    const cleanData = (logs) => logs.map(val => (val === "" || val === null ? null : val));

    const datasets = isGlobal ? allSites.map((site, index) => ({
        label: site.siteName,
        data: cleanData(site.chartRates),
        borderColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        spanGaps: true, // This allows the line to skip empty data
        fill: false,
        tension: 0.3
    })) : [{
        label: 'Survival Rate (%)',
        data: cleanData(dataLogs),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 6,
        spanGaps: true 
    }];

    return <div style={{height: '100%'}}><Line data={{ labels, datasets }} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }} /></div>;
};

export default SurvivalChart;