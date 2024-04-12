import React, { useState } from "react";
import OverviewPage from "./overview";
import TemperatureDependentMortalityPage from "./tempMortality";
import InvasiveInsectsTab from "./invasiveInsects.js"
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Exploring Environmental Resilience and Response</h1>
      </header>
      <div className="tabs">
        {["Overview", "Flight Delays", "Temperature-Dependent Mortality", "Invasive Insects", "Housing Index", "Government Spending"].map(tab => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="content">
        {activeTab === "Overview" && <OverviewPage/>}
        {activeTab === "Flight Delays" && <FlightDelaysTab/>}
        {activeTab === "Temperature-Dependent Mortality" && <TemperatureDependentMortalityPage/>}
        {activeTab === "Invasive Insects" && <InvasiveInsectsTab/>}
        {activeTab === "Housing Index" && <HousingIndexTab/>}
        {activeTab === "Government Spending" && <GovernmentSpendingTab/>}
      </div>
    </div>
  );
}

function FlightDelaysTab() {
  return <div>Flight Delays Page</div>;
}

function HousingIndexTab() {
  return <div>Housing Index</div>;
}

function GovernmentSpendingTab() {
  return <div>Government Spending</div>;
}

export default App;
//Run 'npm start' to run it
