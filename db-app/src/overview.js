import React, { useState } from "react";

function OverviewPage() {
  const [preview, setPreview] = useState("");

  const showPreview = (tab) => {
    switch (tab) {
      case "Severe Weather":
        setPreview(
          "This page allows users to analyze storm data from 1950 to 2023 (grouped by either decade, year, or month),\n" +
            "and allow them to select the time interval, specific types weather events or all weather events, " +
            "as well as possible fatality types associated with those events." +
            " The data is then presented in 3 graphs: (1) Frequency of storm events with respect to time." +
            " (2) Frequency of related deaths with respect to time" +
            " (3) Average age of deaths with respect to time"
        );
        break;
      case "Temperature-Dependent Mortality":
        setPreview("Mortality Preview/Summary");
        break;
      case "Invasive Insects":
        setPreview("Invasive Insects Preview/Summary");
        break;
      case "Housing Index":
        setPreview("Housing Index Preview/Summary");
        break;
      case "Government Spending":
        setPreview("Government Spending Preview/Summary");
        break;
      default:
        setPreview("");
        break;
    }
  };

  return (
    <div>
      <h2>Welcome!</h2>
      <p>Description of Application and Goals</p>
      <div>
        <button onClick={() => showPreview("Severe Weather")}>
          Severe Weather Preview/Summary
        </button>
        <button onClick={() => showPreview("Temperature-Dependent Mortality")}>
          Mortality Preview/Summary
        </button>
        <button onClick={() => showPreview("Invasive Insects")}>
          Invasive Insects Preview/Summary
        </button>
        <button onClick={() => showPreview("Housing Index")}>
          Housing Index Preview/Summary
        </button>
        <button onClick={() => showPreview("Government Spending")}>
          Government Spending Preview/Summary
        </button>
      </div>
      {preview && <p>{preview}</p>}
    </div>
  );
}

export default OverviewPage;
