import React, { useState } from "react";

function HousingIndexTab() {

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
          Select Municipality:
          <select name="municipality" value={generalOptions.county} onChange={handleGeneralChange}>
            <option value="">Select Municipality</option>
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

export default HousingIndexTab;