import React, { useState } from "react";
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
        {activeTab === "Flight Delays" && <FlightDelaysPage/>}
        {activeTab === "Temperature-Dependent Mortality" && <TemperatureDependentMortalityPage/>}
        {activeTab === "Invasive Insects" && <InvasiveInsects/>}
        {activeTab === "Housing Index" && <HousingIndex/>}
        {activeTab === "Government Spending" && <GovernmentSpending/>}
      </div>
    </div>
  );
}

function OverviewPage() {
  return <div>Overview Page</div>;
}

function FlightDelaysPage() {
  return <div>Flight Delays Page</div>;
}

function TemperatureDependentMortalityPage() {
  return <div>Temperature-Dependent Mortality</div>;
}

function InvasiveInsects() {
  return <div>Invasive Insects</div>;
}

function HousingIndex() {
  return <div>Housing Index</div>;
}

function GovernmentSpending() {
  return <div>Government Spending</div>;
}

export default App;
//Run 'npm start' to run it
