import React, { useState } from "react";

function TemperatureDependentMortalityTab() {
  const [generalOptions, setGeneralOptions] = useState({
    stateCounty: [],
    dateRange: [],
    years: []
  });

  const [mortalityRateOptions, setMortalityRateOptions] = useState({
    ageGroup: [],
    causeOfDeath: []
  });

  const [selectedItems, setSelectedItems] = useState([]);
  // Mock data for right now 
  const states = ["State1", "State2", "State3"];
  const counties = ["County1", "County2", "County3"];
  const dateRanges = ["Date Range 1", "Date Range 2", "Date Range 3"];
  const yearRanges = ["2015", "2014", "2013", "2012"];
  const ageGroups = ["0-17", "18-34", "35-49", "50-64", "65+"];
  const causesOfDeath = ["Cause 1", "Cause 2", "Cause 3"];

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralOptions(prevState => ({
      ...prevState,
      [name]: value
    }));
    addSelectedItem(value);
    setGeneralOptions(prevState => ({
      ...prevState,
      state: "",
      county: "",
      dateRange: ""
    }));
  };

  const handleYearsChange = (e) => {
    const { value } = e.target;
    setGeneralOptions(prevState => ({
      ...prevState,
      years: value
    }));
    addSelectedItem(value);
    setGeneralOptions(prevState => ({
      ...prevState,
      state: "",
      county: "",
      dateRange: ""
    }));
  };

  const handleMortalityRateChange = (e) => {
    const { name, value } = e.target;
    setMortalityRateOptions(prevState => ({
      ...prevState,
      [name]: value
    }));
    addSelectedItem(value);
    setMortalityRateOptions(prevState => ({
      ...prevState,
      ageGroup: "",
      causeOfDeath: ""
    }));
  };

  const addSelectedItem = (value) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems([...selectedItems, value]);
    }
  };

  const removeSelectedItem = (value) => {
    setSelectedItems(selectedItems.filter(item => item !== value));
  };

  const generateGraph = () => {
    // Logic for generating the graph based on selected data
    console.log("Generating graph...");
  };

  return (
    <div>
      <h2>Select Criteria</h2>
      <div>
        <h3>General</h3>
        <label>
          Select State:
          <select name="state" value={generalOptions.state} onChange={handleGeneralChange}>
            <option value="">Select State</option>
            {states.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select County:
          <select name="county" value={generalOptions.county} onChange={handleGeneralChange}>
            <option value="">Select County</option>
            {counties.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Date Range:
          <select name="dateRange" value={generalOptions.dateRange} onChange={handleGeneralChange}>
            <option value="">Select Date Range</option>
            {dateRanges.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Year:
          <select name="years" value={generalOptions.years} onChange={handleYearsChange}>
            <option value="">Select Year</option>
            {yearRanges.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <h3>Mortality Rate</h3>
        <label>
          Select Age Group:
          <select name="ageGroup" value={mortalityRateOptions.ageGroup} onChange={handleMortalityRateChange}>
            <option value="">Select Age Group</option>
            {ageGroups.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Cause of Death:
          <select name="causeOfDeath" value={mortalityRateOptions.causeOfDeath} onChange={handleMortalityRateChange}>
            <option value="">Select Cause of Death</option>
            {causesOfDeath.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <h3>Selected Items</h3>
        {selectedItems.map((item) => (
          <div key={item}>
            {item}
            <button onClick={() => removeSelectedItem(item)}>x</button>
          </div>
        ))}
      </div>
      <hr style={{ margin: "20px 0" }} />
      <button onClick={generateGraph}>Generate Graph</button>
    </div>
  );
}

export default TemperatureDependentMortalityTab;
