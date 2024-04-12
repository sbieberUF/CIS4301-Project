import React, { useState } from "react";
import axios from "axios";

async function totalTupleGetter(){
  axios.get("http://localhost:5001/",  { crossdomain: true }).then(response => {
      alert("Total Number of Tuples: " + response.data);
    });
}

function OverviewPage() {
  const [preview, setPreview] = useState("");

  const showPreview = (tab) => {
    switch (tab) {
      case "Flight Delays":
            setPreview("Flight Delays Preview/Summary");
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
      <p class="longtext"> Environmental issues such as climate change and invasive species introductions have had 
        increasingly significant impacts not only on the natural world, but on the economy, politics, 
        and human society. Understanding the extent to which communities are prepared to address 
        existing risks brought about by these factors has become just as important as extrapolating
        how these factors are likely to evolve in the years to come. This application is thus centered
        on the general theme of “climate resilience”, an increasingly popular term encompassing the 
        ability of different entities to adapt to modern environmental challenges. </p>
      <p class="longtext"> Users are invited to explore five distinct dashboards examining severe weather, human health and temperature,
      invasive species burdens on agriculture, property value and precipitation, and,
      lastly, government spending. On each page, trends in these topics can be examined over time and plotted as curves on
      different graphs. Users have the flexibility to select different geographic locations, taxa, agricultural commodities, causes of death, etc.
      depending on the target graph, as well as to select different time scales to refine their questions.
      Our intention is that the application prove valuable to policymakers who must assess where additional action needs to be targeted and which communities
      may act as effective models when it comes to preserving the health and prosperity of citizens amidst climate and ecological disasters. 
      </p>
      <div>
        <button onClick={() => showPreview("Flight Delays")}>Flight Delays Preview/Summary</button>
        <button onClick={() => showPreview("Temperature-Dependent Mortality")}>Mortality Preview/Summary</button>
        <button onClick={() => showPreview("Invasive Insects")}>Invasive Insects Preview/Summary</button>
        <button onClick={() => showPreview("Housing Index")}>Housing Index Preview/Summary</button>
        <button onClick={() => showPreview("Government Spending")}>Government Spending Preview/Summary</button>
      </div>
      {preview && <p>{preview}</p>}
      <p class="longtext"> The data for this project has been derived from several publically available datasets
        published by various agencies of the U.S. government, among other sources. More detail
        on each source is provided on the dashboard pages into which they were incorporated. The total number of tuples
        assimilated into the database can be obtained using the button below. </p>
        <button onClick={() => totalTupleGetter()}> Fetch Total Number of Tuples</button>
    </div>
  );
}

export default OverviewPage;
