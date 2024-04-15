import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
} from "recharts";

function HousingPriceIndexTab() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [housingData, setHousingData] = useState([]);
  const [precipitationData, setPrecipitationData] = useState([]);
  const [excludeOutliers, setExcludeOutliers] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const isOutlier = (value, average) => {
    return Math.abs(value) > 5 * average;
  };

  async function fetchStates() {
    const statesQuery = `SELECT DISTINCT state_name FROM state ORDER BY state_name`;
    try {
      const { data } = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(statesQuery)}`);
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }



  async function fetchData() {
    if (!selectedState) return;

    const housingQuery = `
      SELECT year, index_value, quarter
      FROM rrodriguez7.housing_price_index_state
      WHERE state_name = '${selectedState}'
      ORDER BY year, quarter
    `;
    const precipitationQuery = `
      SELECT qp.quarter, qp.amount, qp.precipitation_year
      FROM rrodriguez7.quarterly_precipitation qp
      JOIN weather_station ws ON qp.station_id = ws.station_id
      WHERE ws.state_name = '${selectedState}'
      ORDER BY qp.precipitation_year, qp.quarter
    `;

    try {
      const housingResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(housingQuery)}`);
      const precipitationResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(precipitationQuery)}`);

      const averagePrecipitation = precipitationResponse.data.reduce((acc, [quarter, amount, year]) => acc + amount, 0) / precipitationResponse.data.length;


      const formattedHousingData = housingResponse.data.map(([year, index_value, quarter]) => ({
        year,
        index_value,
        quarter
      }));

      const formattedPrecipitationData = precipitationResponse.data.map(([quarter, amount, precipitation_year]) => ({
        quarter,
        amount,
        precipitation_year
      }));

      const filteredPrecipitationData = precipitationResponse.data
        .filter(([quarter, amount, precipitation_year]) => amount >= 0)
        .map(([quarter, amount, precipitation_year]) => ({
          quarter,
          amount: excludeOutliers && isOutlier(amount, averagePrecipitation) ? 0 : amount,
          precipitation_year
        }));

      setHousingData(formattedHousingData);
      setPrecipitationData(filteredPrecipitationData);

      console.log(formattedHousingData);
      console.log(formattedPrecipitationData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div>
      <h2>Housing Price Index and Precipitation Analysis</h2>
      <label>
        Select State:
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </label>
      <label>
        Exclude Outliers
        <input
          type="checkbox"
          checked={excludeOutliers}
          onChange={(e) => setExcludeOutliers(e.target.checked)}
        />
      </label>
      <button onClick={fetchData}>Load Data</button>

      <LineChart width={600} height={300} data={housingData}>
        <XAxis dataKey="year" />
        <YAxis yAxisId="left" orientation="left" />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="index_value" stroke="#8884d8" yAxisId="left" />
      </LineChart>

      <LineChart width={600} height={300} data={precipitationData}>
        <XAxis dataKey="precipitation_year" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="amount" stroke="#82ca9d" yAxisId="right" />
      </LineChart>
      <LineChart width={600} height={300}>
        <XAxis dataKey="year" />
        <YAxis yAxisId="left" orientation="left" label={{ value: 'Index Value', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Precipitation', angle: 90, position: 'insideRight' }} />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Legend />
        <Line type="monotone" dataKey="index_value" stroke="#8884d8" yAxisId="left" name="Housing Price Index" data={housingData} />
        <Line type="monotone" dataKey="amount" stroke="#82ca9d" yAxisId="right" name="Precipitation" data={precipitationData} />
      </LineChart>
    </div>
  );
}

export default HousingPriceIndexTab;
