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

function TemperatureDependentMortalityTab() {
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [years, setYears] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [tableData, setTableData] = useState({ temperatureData: [], mortalityData: [] });
  const [temperatureData, setTemperatureData] = useState([]);
  const [mortalityData, setMortalityData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch states
      const statesQuery = `
        SELECT DISTINCT STATE
        FROM SBIEBER.AVGTEMPERATUREBYSTATECOUNTY
        ORDER BY STATE
      `;

      try {
        const statesResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(statesQuery)}`, {
          crossdomain: true,
        });
        const statesData = statesResponse.data;
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
      }

      // Fetch years
      const yearsQuery = `
        SELECT DISTINCT YEAR
        FROM SBIEBER.AVGTEMPERATUREBYSTATECOUNTY
        ORDER BY YEAR
      `;

      try {
        const yearsResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(yearsQuery)}`, {
          crossdomain: true,
        });
        const yearsData = yearsResponse.data;
        setYears(yearsData);
      } catch (error) {
        console.error("Error fetching years:", error);
      }

      // Fetch age groups
      const ageGroupsQuery = `
        SELECT DISTINCT AGE_GROUP
        FROM SBIEBER.MORTALITYBYSTATECOUNTY
        ORDER BY AGE_GROUP
      `;

      try {
        const ageGroupsResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(ageGroupsQuery)}`, {
          crossdomain: true,
        });
        const ageGroupsData = ageGroupsResponse.data;
        setAgeGroups(ageGroupsData);
      } catch (error) {
        console.error("Error fetching age groups:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCounties() {
      // Fetch counties for selected states
      let selectedCounties = [];
      for (const state of selectedStates) {
        const countiesQuery = `
          SELECT DISTINCT COUNTY
          FROM SBIEBER.MORTALITYBYSTATECOUNTY
          WHERE STATE = '${state}'
          ORDER BY COUNTY
        `;

        try {
          const countiesResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(countiesQuery)}`, {
            crossdomain: true,
          });
          const countiesData = countiesResponse.data;
          selectedCounties = [...selectedCounties, ...countiesData];
        } catch (error) {
          console.error("Error fetching counties:", error);
        }
      }
      setCounties(selectedCounties);
    }

    if (selectedStates.length > 0) {
      fetchCounties();
    }
  }, [selectedStates]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedStates((prevSelectedStates) =>
      prevSelectedStates.includes(state)
        ? prevSelectedStates.filter((selectedState) => selectedState !== state)
        : [...prevSelectedStates, state]
    );
    setSelectedCounties([]); // Reset counties when state changes
  };

  const handleCountyChange = (e) => {
    const county = e.target.value;
    setSelectedCounties((prevSelectedCounties) =>
      prevSelectedCounties.includes(county)
        ? prevSelectedCounties.filter((selectedCounty) => selectedCounty !== county)
        : [...prevSelectedCounties, county]
    );
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYears((prevSelectedYears) =>
      prevSelectedYears.includes(year)
        ? prevSelectedYears.filter((selectedYear) => selectedYear !== year)
        : [...prevSelectedYears, year]
    );
  };

  const handleAgeGroupChange = (e) => {
    const ageGroup = e.target.value;
    setSelectedAgeGroups((prevSelectedAgeGroups) =>
      prevSelectedAgeGroups.includes(ageGroup)
        ? prevSelectedAgeGroups.filter((selectedAgeGroup) => selectedAgeGroup !== ageGroup)
        : [...prevSelectedAgeGroups, ageGroup]
    );
  };

  const handleDisplayData = async () => {
    // Fetch data for selected criteria from SBIEBER.AVGTEMPERATUREBYSTATECOUNTY
    let temperatureQuery = `
  SELECT AVGTEMPERATURE, MEAN, ANOMALY, COUNTY, YEAR
  FROM SBIEBER.AVGTEMPERATUREBYSTATECOUNTY
  WHERE (${selectedStates.length > 0 ? `STATE IN (${selectedStates.map((state) => `'${state}'`).join(", ")})` : "1=1"})
`;

let mortalityQuery = `
  SELECT DEATHS, POPULATION, CRUDE_DEATH_RATE, COUNTY, YEAR, AGE_GROUP
  FROM SBIEBER.MORTALITYBYSTATECOUNTY
  WHERE (${selectedStates.length > 0 ? `STATE IN (${selectedStates.map((state) => `'${state}'`).join(", ")})` : "1=1"})
`;

if (selectedYears.includes("ALL")) {
} else if (selectedYears.length > 0) {
  temperatureQuery += ` AND YEAR IN (${selectedYears.map((year) => `'${year}'`).join(", ")})`;
  mortalityQuery += ` AND YEAR IN (${selectedYears.map((year) => `'${year}'`).join(", ")})`;
}

if (selectedCounties.includes("ALL")) {
} else if (selectedCounties.length > 0) {
  temperatureQuery += ` AND COUNTY IN (${selectedCounties.map((county) => `'${county}'`).join(", ")})`;
  mortalityQuery += ` AND COUNTY IN (${selectedCounties.map((county) => `'${county}'`).join(", ")})`;
}

if (selectedAgeGroups.length > 0 && !selectedAgeGroups.includes("ALL")) {
  mortalityQuery += ` AND (${selectedAgeGroups.map((ageGroup) => `AGE_GROUP = '${ageGroup}'`).join(" OR ")})`;
}


    try {
      const temperatureResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(temperatureQuery)}`, {
        crossdomain: true,
      });
      const temperatureData = temperatureResponse.data;

      const mortalityResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(mortalityQuery)}`, {
        crossdomain: true,
      });
      const mortalityData = mortalityResponse.data;

      setTableData({ temperatureData, mortalityData });
      setTemperatureData(temperatureData.map(data => ({
        year: parseInt(data[4]), 
        average_temperature: data[0],
        mean: data[1],
        anomaly: data[2],
      })).sort((a, b) => a.year - b.year));
      setMortalityData(mortalityData.map(data => ({
        year: data[4],
        crude_death_rate: data[0],
      })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


      const getRandomColor = () => {
        return "#" + ((Math.random() * 0xffff) << 0).toString(16).padStart(6, "0");
      };
      //generate the individual lines
      const lines = (dat) => {
        const entries = dat.map((option) => {
          const keys = Object.keys(option);
          return keys;
        });
        const flattened = entries.reduce((prev, current) => {
          prev = prev.concat(current);
          return prev;
        }, []);
        const filtered = flattened.filter((key) => key !== "year");
        const uniqueKeys = [...new Set(filtered)];
        return uniqueKeys.map((key) => {
          return (
            <Line
              name={key}
              type="monotone"
              stroke={getRandomColor()}
              dataKey={key}
              dot={false}
            />
          );
        });
      };



      const temperatureDatatest = [
        { year: "2010", average_temperature: 25 },
        { year: "2011", average_temperature: 26 },
        // Add more data points
      ];


  return (
    <><div>
      <h2>Select Criteria</h2>
      <div style={{ textAlign: "center" }}>
        <div>
          <h3>General</h3>
          <label>
            Select State:
            <select multiple value={selectedStates} onChange={handleStateChange}>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Select County:
            <select multiple value={selectedCounties} onChange={handleCountyChange}>
              <option value="ALL">ALL</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Select Year:
            <select multiple value={selectedYears} onChange={handleYearChange}>
              <option value="ALL">ALL</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <br />
          <br />
          <label>
            Select Age Group:
            <select multiple value={selectedAgeGroups} onChange={handleAgeGroupChange}>
              <option value="ALL">ALL</option>
              {ageGroups.map((ageGroup) => (
                <option key={ageGroup} value={ageGroup}>
                  {ageGroup}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button onClick={handleDisplayData}>Display Data</button>
        </div>

        <h3>Temperature Data</h3>
        <table style={{ margin: "0 auto" }}>
          <thead>
            <tr>
              <th>Average Temperature</th>
              <th>Mean</th>
              <th>Anomaly</th>
              <th>County</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
          {tableData.temperatureData &&
            tableData.temperatureData
              .slice() // Create a copy of the array
              .sort((a, b) => a[4] - b[4]) // Sort by year in ascending order
              .map((data, index) => (
                <tr key={index}>
                  <td>{data[0]}</td>
                  <td>{data[1]}</td>
                  <td>{data[2]}</td>
                  <td>{data[3]}</td>
                  <td>{data[4]}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <hr />

        <h3>Mortality Data</h3>
        <table style={{ margin: "0 auto" }}>
          <thead>
            <tr>
              <th>Deaths</th>
              <th>Population</th>
              <th>Crude Death Rate</th>
              <th>County</th>
              <th>Year</th>
              <th>Age Group</th>
            </tr>
          </thead>
          <tbody>
            {tableData.mortalityData && tableData.mortalityData.length > 0 ? (
              tableData.mortalityData.map((data, index) => (
                <tr key={index}>
                  <td>{data[0]}</td>
                  <td>{data[1]}</td>
                  <td>{data[2]}</td>
                  <td>{data[3]}</td>
                  <td>{data[4]}</td>
                  <td>{data[5]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data found for this criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="graphs" style={{ display: "inline-block", width: "70%", height: "550px", overflowY: "scroll" }}>
      {temperatureData.length > 0 && (
        <div style={{ alignContent: "center" }}>
          <h2>Average Temperature By State And County Over Time</h2>
          <br />
          <div style={{ display: "inline-block" }}>
            <LineChart width={800} height={400} data={temperatureData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="top" align="right" height={36} />
              {lines(temperatureData)}
            </LineChart>
          </div>
        </div>
      )}
      {mortalityData.length > 0 && (
        <div style={{ alignContent: "center" }}>
          <h2>Mortality Rates By State And County Over Time</h2>
          <br />
          <div style={{ display: "inline-block" }}>
            <LineChart width={800} height={400} data={mortalityData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="top" align="right" height={36} />
              {lines(mortalityData)}
            </LineChart>
          </div>
        </div>
      )}
    </div>
            </div> </>
          );
        }


export default TemperatureDependentMortalityTab;
