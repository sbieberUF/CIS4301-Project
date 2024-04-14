import React, { useState, useEffect } from "react";
import axios from "axios";

function TemperatureDependentMortalityTab() {
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [years, setYears] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [tableData, setTableData] = useState([]);

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
      // Fetch counties for selected state
      const countiesQuery = `
        SELECT DISTINCT COUNTY
        FROM SBIEBER.MORTALITYBYSTATECOUNTY
        WHERE STATE = '${selectedState}'
        ORDER BY COUNTY
      `;

      try {
        const countiesResponse = await axios.get(`http://localhost:5001/?query=${encodeURIComponent(countiesQuery)}`, {
          crossdomain: true,
        });
        const countiesData = countiesResponse.data;
        setCounties(countiesData);
      } catch (error) {
        console.error("Error fetching counties:", error);
      }
    }

    if (selectedState) {
      fetchCounties();
    }
  }, [selectedState]);

  

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCounty(""); // Reset counties when state changes
  };

  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleAgeGroupChange = (e) => {
    setSelectedAgeGroup(e.target.value);
  };

  const handleDisplayData = async () => {
    // Fetch data for selected criteria from SBIEBER.AVGTEMPERATUREBYSTATECOUNTY
    const temperatureQuery = `
    SELECT AVGTEMPERATURE, MEAN, ANOMALY, COUNTY, YEAR
    FROM SBIEBER.AVGTEMPERATUREBYSTATECOUNTY
    WHERE STATE = '${selectedState}'
    ${selectedYear !== "ALL" ? `AND YEAR = '${selectedYear}'` : ""}
    ${selectedCounty !== "ALL" ? `AND COUNTY = '${selectedCounty}'` : ""}
  `;

  let mortalityQuery = `
    SELECT DEATHS, POPULATION, CRUDE_DEATH_RATE, COUNTY, YEAR, AGE_GROUP
    FROM SBIEBER.MORTALITYBYSTATECOUNTY
    WHERE STATE = '${selectedState}'
    ${selectedYear !== "ALL" ? `AND YEAR = '${selectedYear}'` : ""}
    ${selectedCounty !== "ALL" ? `AND COUNTY = '${selectedCounty}'` : ""}
  `;

  if (selectedAgeGroup !== "ALL") {
    mortalityQuery += ` AND AGE_GROUP = '${selectedAgeGroup}'`;
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
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  
const generateGraph = () => {
  // Logic for generating the graph based on selected data
  console.log("Generating graph...");
};
  

  return (
    <div>
      <h2>Select Criteria</h2>
      <div style={{ textAlign: 'center' }}>
      <div>
        <h3>General</h3>
        <label>
          Select State:
          <select value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select County:
          <select value={selectedCounty} onChange={handleCountyChange}>
            <option value="">Select County</option>
            <option value="ALL">ALL</option>
            {counties.map((county) => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Year:
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Year</option>
            <option value="ALL">ALL</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <label>
          Select Age Group:
          <select value={selectedAgeGroup} onChange={handleAgeGroupChange}>
            <option value="">Select Age Group</option>
            <option value="ALL">ALL</option>
            {ageGroups.map((ageGroup) => (
              <option key={ageGroup} value={ageGroup}>{ageGroup}</option>
            ))}
          </select>
        </label>
        <br />
        <button onClick={handleDisplayData}>Display Data</button>
      </div>
  
      <h3>Display Data</h3>
      <table style={{ margin: '0 auto' }}>
    <table>
        <thead>
          <tr>
            <th>AVGTEMPERATURE</th>
            <th>MEAN</th>
            <th>ANOMALY</th>
            <th>COUNTY</th>
            <th>YEAR</th>
          </tr>
        </thead>
        <tbody>
          {tableData.temperatureData && tableData.temperatureData.map((data, index) => (
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
  </table>

    <hr /> 

    <h3>Mortality Data</h3>
    <table style={{ margin: '0 auto' }}>
    <table>
      <thead>
        <tr>
          <th>DEATHS</th>
          <th>POPULATION</th>
          <th>CRUDE_DEATH_RATE</th>
          <th>COUNTY</th>
          <th>YEAR</th>
          <th>AGE_GROUP</th>
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
            <td colSpan="4">No data found for this age group</td>
          </tr>
        )}
      </tbody>
      </table>
      </table>
    </div>
    <hr style={{ margin: "20px 0" }} />
          <button onClick={generateGraph}>Generate Graph</button>
    </div>
  );
  
}


export default TemperatureDependentMortalityTab;
