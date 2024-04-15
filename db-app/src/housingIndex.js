import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, ReferenceLine } from "recharts";
import { format } from 'date-fns';

function HousingPriceIndexTab() {
  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [housingData, setHousingData] = useState([]);
  const [precipitationData, setPrecipitationData] = useState([]);
  const [excludeOutliers, setExcludeOutliers] = useState(false);
  const [averagePrecipitation, setAveragePrecipitation] = useState(0);
  const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1', '#83a6ed', '#8884d8', '#82ca9d'];

  useEffect(() => {
    fetchStates();
  }, []);

  const formatXAxisTick = (tickItem) => {

    return format(new Date(tickItem, 0, 1), 'yyyy');
  };

  const fetchStates = async () => {
    const statesQuery = 'SELECT DISTINCT state_name FROM state ORDER BY state_name';
    try {
      const { data } = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(statesQuery)}`);
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchData = async () => {
    if (selectedStates.length === 0) return;

    const housingQuery = `
      SELECT year, index_value, quarter, state_name
      FROM housing_price_index_state
      WHERE state_name IN (${selectedStates.map(state => `'${state}'`).join(", ")})
      ORDER BY year, quarter
    `;

    const precipitationQuery = `
      SELECT qp.quarter, qp.amount, qp.precipitation_year, ws.state_name
      FROM quarterly_precipitation qp
      JOIN weather_station ws ON qp.station_id = ws.station_id
      WHERE ws.state_name IN (${selectedStates.map(state => `'${state}'`).join(", ")})
      ORDER BY qp.precipitation_year, qp.quarter
    `;

    try {
      const [housingResponse, precipitationResponse] = await Promise.all([
        axios.get(`http://localhost:5001/?query=${encodeURIComponent(housingQuery)}`),
        axios.get(`http://localhost:5001/?query=${encodeURIComponent(precipitationQuery)}`)
      ]);
      console.log('Precipitation Response:', precipitationResponse.data);

      const formattedHousingData = housingResponse.data.map(([year, index_value, quarter, state_name]) => ({
        year, index_value, quarter, stateName: state_name
      }));

      const totalPrecipitation = precipitationResponse.data.reduce((acc, { amount }) => acc + amount, 0);
      const newAveragePrecipitation = totalPrecipitation / precipitationResponse.data.length;
      setAveragePrecipitation(newAveragePrecipitation);

      const formattedPrecipitationData = precipitationResponse.data.map((item) => {
        const [quarter, amount, precipitation_year, state_name] = item;
        return {
          quarter,
          amount,
          precipitation_year,
          stateName: state_name
        };
      }).filter(({ amount }) => amount >= 0 && (!excludeOutliers || !isOutlier(amount, newAveragePrecipitation)));

      console.log("Housing Data: ", formattedHousingData);
      console.log("Precipitation Data: ", formattedPrecipitationData);

      let housingConsolidated = {};
      housingResponse.data.forEach(([year, index_value, quarter, state_name]) => {
        const key = `${year}-${quarter}`;
        if (!housingConsolidated[key]) {
          housingConsolidated[key] = { year, quarter };
        }
        housingConsolidated[key][`housingIndex_${state_name}`] = index_value;
      });


      let precipitationConsolidated = {};
      precipitationResponse.data.forEach(([quarter, amount, precipitation_year, state_name]) => {
        const key = `${precipitation_year}-${quarter}`;
        if (!precipitationConsolidated[key]) {
          precipitationConsolidated[key] = { precipitation_year, quarter };
        }
        precipitationConsolidated[key][`precipitationAmount_${state_name}`] = amount;
      });


      const housingDataArray = Object.values(housingConsolidated)
        .map(data => ({ ...data, year: `${data.year}` }))
        .filter(data => {
          const values = selectedStates.map(state => data[`housingIndex_${state}`]);
          return values.every(value => value >= 0);
        });
      const precipitationDataArray = Object.values(precipitationConsolidated)
        .map(data => ({ ...data, precipitation_year: `${data.precipitation_year}` }))
        .filter(data => {
          const values = selectedStates.map(state => data[`precipitationAmount_${state}`]);

          return values.every(value => value >= 0 && (!excludeOutliers || !isOutlier(value, averagePrecipitation)));
        });


      setHousingData(housingDataArray);
      setPrecipitationData(precipitationDataArray);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedStates(prev => prev.includes(value) ? prev.filter(state => state !== value) : [...prev, value]);
  };

  const isOutlier = (value, average) => Math.abs(value) > 5 * average;

  return (
    <div>
      <h2>Housing Price Index and Precipitation Analysis</h2>
      <label>
        Select State:
        <select multiple value={selectedStates} onChange={handleStateChange} size={3} style={{ overflowY: 'auto', width: '100%' }}>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

      </label>
      <label>
        Exclude Outliers
        <input type="checkbox" checked={excludeOutliers} onChange={(e) => setExcludeOutliers(e.target.checked)} />
      </label>
      <button onClick={fetchData}>Load Data</button>

      <LineChart width={600} height={300} data={housingData}>
        <XAxis dataKey="year" tickFormatter={formatXAxisTick} />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Legend />
        {selectedStates.map((state, index) => (
          <Line
            key={state}
            type="monotone"
            dataKey={`housingIndex_${state}`}
            stroke={lineColors[index % lineColors.length]}
            name={`Housing Index - ${state}`}
          />
        ))}
      </LineChart>

      <LineChart width={600} height={300} data={precipitationData}>
        <XAxis dataKey="precipitation_year" tickFormatter={formatXAxisTick} />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Legend />
        {selectedStates.map((state, index) => (
          <Line
            key={state}
            type="monotone"
            dataKey={`precipitationAmount_${state}`}
            stroke={lineColors[index % lineColors.length]}
            name={`Precipitation - ${state}`}
          />
        ))}
      </LineChart>

    </div>
  );
}
export default HousingPriceIndexTab;
