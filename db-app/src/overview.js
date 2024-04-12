import React, { useState } from "react";

function OverviewPage() {
  const [preview, setPreview] = useState("");

  const showPreview = (tab) => {
    switch (tab) {
      case "Severe Weather":
        setPreview("Severe Weather Preview/Summary");
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
