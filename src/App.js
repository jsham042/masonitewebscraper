import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


const App = () => {
    const [data, setData] = useState([]);
    const [selectedSku, setSelectedSku] = useState('');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Fetch data from your backend API
        const fetchData = async () => {
            try {
                const response = await fetch('/api/scrape');
                const fetchedData = await response.json();
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setSelectedSku(e.target.value);
        const skuData = data.find((item) => item.sku === e.target.value);
        setChartData(skuData ? skuData.weeklyPrices : []);
    };

    const uniqueSkus = Array.from(new Set(data.map((item) => item.sku)));

    return (
        <div>
            <select value={selectedSku} onChange={handleChange}>
                <option value="">Select a SKU</option>
                {uniqueSkus.map((sku) => (
                    <option key={sku} value={sku}>
                        {sku}
                    </option>
                ))}
            </select>

            <Line
                data={{
                    labels: chartData.map((item) => item.week),
                    datasets: [
                        {
                            label: 'Price',
                            data: chartData.map((item) => item.price),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                        },
                    ],
                }}
            />
        </div>
    );
};

export default App;
