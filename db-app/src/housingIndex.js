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
  const [municipalities, setMunicipalities] = useState([]);
  const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1', '#83a6ed', '#8884d8', '#82ca9d'];
  const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [tableData, setTableData] = useState([]);

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

  const fetchMunicipalities = async (state) => {
    if (!state) return;
    const municipalitiesQuery = `SELECT DISTINCT municipality_name FROM municipality WHERE state_name = '${state}' ORDER BY municipality_name`;
    try {
      const { data } = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(municipalitiesQuery)}`);
      setMunicipalities(data);
      setSelectedMunicipalities([]);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };

  const fetchYears = async (state, municipality) => {
    if (!state) return;

    let yearsQuery = `SELECT DISTINCT hs.year FROM housing_price_index_state hs`;

    if (municipality) {
      yearsQuery += ` INNER JOIN municipality mp ON hs.state_name = mp.state_name 
                       WHERE hs.state_name = '${state}' AND mp.municipality_name = '${municipality}'`;
    } else {
      yearsQuery += ` WHERE hs.state_name = '${state}'`;
    }

    yearsQuery += ' ORDER BY hs.year';

    try {
      const response = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(yearsQuery)}`);
      if (response && response.data && Array.isArray(response.data)) {
        console.log('Response:', response.data)
        //const years = response.data.map(item => item.year).filter(year => typeof year === 'number');
        setYears(response.data);
        console.log('Years:', years);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchData = async () => {
    if (selectedStates.length === 0) return;

    const housingQuery = `
    SELECT 
      DISTINCT hpic.year, 
      hpic.quarter, 
      hpic.index_value, 
      hpic.state_name,
      m.municipality_name
    FROM 
      housing_price_index_city hpic
    JOIN 
      municipality m ON hpic.municipality_name = m.municipality_name AND hpic.state_name = m.state_name
    JOIN 
      weather_station ws ON m.municipality_name = ws.municipality_name AND m.state_name = ws.state_name
    JOIN 
      quarterly_precipitation qp ON ws.station_id = qp.station_id AND hpic.year = qp.precipitation_year
    WHERE 
      hpic.state_name IN (${selectedStates.map(state => `'${state}'`).join(", ")})
    ORDER BY 
      hpic.year, hpic.quarter
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
      console.log('Housing Response:', housingResponse.data);
      console.log('Precipitation Response:', precipitationResponse.data);

      const formattedHousingData = housingResponse.data.map(([year, quarter, index_value, state_name, municipality_name]) => ({
        year,
        quarter,
        index_value,
        stateName: state_name,
        municipalityName: municipality_name,
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
      housingResponse.data.forEach(([year, quarter, index_value, state_name]) => {
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

      const formattedTableData = housingResponse.data.map(([year, quarter, index_value, state_name, municipality_name]) => ({
        year,
        state: state_name,
        housingIndex: index_value,
        municipality: municipality_name,
      }));

      setTableData(formattedTableData);

      setHousingData(housingDataArray);
      setPrecipitationData(precipitationDataArray);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStateChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedStates(selectedValues);

    if (selectedValues.length > 0) {
      const selectedState = selectedValues[0];
      fetchMunicipalities(selectedState);
      fetchYears(selectedState);
    } else {
      setYears([]);
    }
  };

  const isOutlier = (value, average) => Math.abs(value) > 5 * average; // TODO: Tweak outlier detection calculation

  return (
    <div>
      <h2>Housing Price Index and Precipitation Analysis</h2>
      <div>
        <label>
          Select State:
          <select multiple value={selectedStates} onChange={handleStateChange} size={10}>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <label>
          Select Municipality:
          <select multiple value={selectedMunicipalities} onChange={(e) => setSelectedMunicipalities([...e.target.selectedOptions].map(option => option.value))} size={10}>
            {municipalities.map(municipality => (
              <option key={municipality} value={municipality}>{municipality}</option>
            ))}
          </select>
        </label>
        <label>
          Select Year:
          <select multiple value={selectedYears} onChange={(e) => setSelectedYears([...e.target.selectedOptions].map(option => option.value))} size={10}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>
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

      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>State</th>
            <th>Housing Index</th>
            <th>Municipality</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.year}</td>
              <td>{data.state}</td>
              <td>{data.housingIndex}</td>
              <td>{data.municipality}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
export default HousingPriceIndexTab;
