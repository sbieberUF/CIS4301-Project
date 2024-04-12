import React, { useState } from "react";

function InvasiveInsectsTab() {
  const [generalOptions, setGeneralOptions] = useState({
    stateCounty: [],
    dateRange: [],
    years: []
  });

  const [insectOptions, setInsectOptions] = useState({
    taxonLevel: [],
    taxa: []
  });
  const [farmIncomeOptions, setFarmIncomeOptions] = useState({
    dataType: [],
    incomeCategory: []
  });

  const [selectedItems, setSelectedItems] = useState([]);
  // Mock data for right now 
  const states = ["State1", "State2", "State3"];
  const counties = ["County1", "County2", "County3"];
  const dateRanges = ["Date Range 1", "Date Range 2", "Date Range 3"];
  const yearRanges = ["2015", "2014", "2013", "2012"];
  const taxonLevels = ["Order", "Family", "Genus"];
  const taxa = ["Example Taxa 1", "Example Taxa 2", "Example Taxa 3"];
  const dataTypes = ["data type 1", "data type 2", "data type 3"];
  const incomeCategories = ["example cat 1", "example cat 2", "example cat 3"];

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

  const handleInsectChange = (e) => {
    const { name, value } = e.target;
    setInsectOptions(prevState => ({
      ...prevState,
      [name]: value
    }));
    addSelectedItem(value);
    setInsectOptions(prevState => ({
      ...prevState,
      taxonLevel: "",
      taxa: ""
    }));
  };

  const handleFarmIncomeChange = (e) => {
    const { name, value } = e.target;
    setFarmIncomeOptions(prevState => ({
      ...prevState,
      [name]: value
    }));
    addSelectedItem(value);
    setFarmIncomeOptions(prevState => ({
      ...prevState,
      dataType: "",
      incomeCategory: ""
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
        <h3>Farm Income/Expense Data:</h3>
        <label>
          Select Farm Income Data Type:
          <select name="dataType" value={farmIncomeOptions.dataType} onChange={handleFarmIncomeChange}>
            <option value="">Select Income Data Type</option>
            {dataTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Category:
          <select name="incomeCategory" value={farmIncomeOptions.incomeCategory} onChange={handleFarmIncomeChange}>
            <option value="">Select Category</option>
            {incomeCategories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <h3>Insect Observations</h3>
        <label>
          Select Taxon Level:
          <select name="taxonLevel" value={insectOptions.taxonLevel} onChange={handleInsectChange}>
            <option value="">Select Taxon Level</option>
            {taxonLevels.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Taxa:
          <select name="taxa" value={insectOptions.taxa} onChange={handleInsectChange}>
            <option value="">Select Taxa</option>
            {taxa.map((option) => (
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

export default InvasiveInsectsTab;
