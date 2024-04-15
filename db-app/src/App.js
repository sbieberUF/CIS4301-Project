import React, { useState } from "react";
import OverviewPage from "./overview";
import TemperatureDependentMortalityPage from "./tempMortality";
import InvasiveInsectsTab from "./invasiveInsects.js";
import SevereWeatherTab from "./severeWeather.js";
import HousingIndexTab from "./housingIndex.js";
import GovernmentSpending from "./governmentSpending.js";
import SimpsonTab from "./simpson.js";


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
        {[
          "Overview",
          "Severe Weather",
          "Temperature-Dependent Mortality",
          "Insect Diversity",
          "Invasive Insects",
          "Housing Index",
          "Government Spending"
        ].map((tab) => (
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
        {activeTab === "Overview" && <OverviewPage />}
        {activeTab === "Severe Weather" && <SevereWeatherTab />}
        {activeTab === "Temperature-Dependent Mortality" && (
          <TemperatureDependentMortalityPage />
        )}
        {activeTab === "Insect Diversity" && <SimpsonTab />}
        {activeTab === "Invasive Insects" && <InvasiveInsectsTab />}
        {activeTab === "Housing Index" && <HousingIndexTab />}
        {activeTab === "Government Spending" && <GovernmentSpending />}
      </div>
    </div>
  );
}


export default App;
//Run 'npm start' to run it
