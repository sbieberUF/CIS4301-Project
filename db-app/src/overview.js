import React, { useState } from "react";
import axios from "axios";

const totaltupletext =
  'SELECT SUM(c) FROM (SELECT COUNT(*) AS c FROM MIRANDABARNES.observation UNION SELECT COUNT(*) AS c FROM MIRANDABARNES.cash_receipt UNION SELECT COUNT(*) AS c FROM MIRANDABARNES.insect UNION SELECT COUNT(*) AS c FROM MIRANDABARNES.intermediate_product_expense UNION SELECT COUNT(*) AS c FROM MIRANDABARNES.inventory_change_value UNION SELECT COUNT(*) AS c FROM MIRANDABARNES.state UNION SELECT COUNT(*) AS c FROM "A.KUMAWAT".co2_emission UNION SELECT COUNT(*) AS c FROM "A.KUMAWAT".country_data UNION SELECT COUNT(*) AS c FROM "A.KUMAWAT".policy_expenditure_datum UNION SELECT COUNT(*) AS c FROM "A.KUMAWAT".population_datum UNION SELECT COUNT(*) AS c FROM "JASON.LI1".counties UNION SELECT COUNT(*) AS c FROM "JASON.LI1".storm_event UNION SELECT COUNT(*) AS c FROM "JASON.LI1".storm_fatality UNION SELECT COUNT(*) AS c FROM "JASON.LI1".storm_loc UNION SELECT COUNT(*) AS c FROM "SBIEBER".avgtemperaturebystatecounty UNION SELECT COUNT(*) AS c FROM "SBIEBER".mortalitybystatecounty UNION (SELECT COUNT(*) AS c FROM "RRODRIGUEZ7".housing_price_index_city) UNION (SELECT COUNT(*) AS c FROM "RRODRIGUEZ7".housing_price_index_state) UNION (SELECT COUNT(*) AS c FROM "RRODRIGUEZ7".municipality) UNION (SELECT COUNT(*) AS c FROM "RRODRIGUEZ7".quarterly_precipitation) UNION (SELECT COUNT(*) AS c FROM "RRODRIGUEZ7".weather_station))';

async function totalTupleGetter() {
  axios
    .get(`http://localhost:5001/?query=${encodeURIComponent(totaltupletext)}`, {
      crossdomain: true,
    })
    .then((response) => {
      alert("Total Number of Tuples: " + response.data);
    });
}

function OverviewPage() {
  const [preview, setPreview] = useState("");

  const showPreview = (tab) => {
    switch (tab) {
      case "Severe Weather":
        setPreview(
          "Severe Weather Summary: This page allows users to analyze storm data from 1950 to 2023 (grouped by either decade, year, or month),\n" +
            "and allow them to select the time interval, specific types weather events or all weather events, " +
            "as well as possible fatality types associated with those events." +
            " The data is then presented in 3 graphs: (1) Frequency of storm events with respect to time." +
            " (2) Frequency of related deaths with respect to time" +
            " (3) Average age of deaths with respect to time. " +
            "Data for this set came from the National Oceanic and Atmospheric Administration."
        );
        break;
      case "Temperature-Dependent Mortality":
        setPreview("This page fetches and displays data related to average temperature and mortality rates based on user-selected criteria such\n" +
         "as state, county, year, and age group. The years selectable range from 1979 to 2015 and all of the data is gathered from the\n" +
         "United States. Users can select criteria, view the data in tables, and see the corresponding\n" +
         "charts for temperature and mortality rates over time. Temperature is the average temperature of selected state(s)/county(ies) and mortality rate is the\n" +
         "calculated crude death rate from the data: Crude Rates are expressed as the number of deaths reported each calendar year per 100,000 population, reporting\n" +
         "the death rate per 100,000 persons. Crude Rate = Count / Population * 100,000. " +
         "Data for this set came from the Centers for Disease Control and Prevention and the National Oceanic and Atmospheric Administration.");
        break;
      case "Invasive Insects":
        setPreview("This page is designed with the goal of a) determining the extent to which iNaturalist observations serve as an effective proxy for damage caused\n" +
        "by different invasive insect pests by contrasting volume of normalized observations over a specified time frame to various measures of agricultural costs and\n" +
        "output over that same time frame and b) where iNaturalist seems to prove an effective tool, examining the per dollar extent to which invasive insect occurrences\n" +
        "in different locations affect various measures of output and expenses as a measure of resilience of different states/commodities/sectors, etc. to invasive insects\n" +
        "Datasets for this part of the application are derived from iNaturalist, the Global Register of Introduced and Invasive Species - United States (Contiguous),\n" +
        "and the Economic Research Service of the U.S. Department of Agriculture.");
        break;
      case "Insect Diversity":
        setPreview("More diverse ecosytems are more likely to be robust to stressors and provide a wider array of important ecosystem services.\n" +
        "This page is meant to allow users to use iNaturalist to gauge relative levels of diversity between different locations, specifically via Simpson's index.\n" +
        "This metric gets smaller the more diverse a population is. Users can determine how diverse their states/counties are relative to each other, as well as select\n" +
        "specific taxa whose level of diversity they want to assess in more detail. Data for this part of the application came from iNaturalist.");
        break;
      case "Housing Index":
        setPreview("This page examines the degree to which deviations from average precipitation (i.e., flooding and drought conditions) impact housing price index in different\n" +
        "places in the United States over time. This should not only demonstrate how such events can affect property value, but also allow a user to answer questions about whether\n" +
        "different localities are equally impacted by equivalent precipitation problems. The precipitation data comes from the National Centers for Environmental Information,\n" +
        "and the housing index data is derived from a set made available by the  Federal Housing Finance Agency.");
        break;
      case "Government Spending":
        setPreview("To move from analyses of impact to analyses of action, we also incorporate a final graph using a dataset from the International Monetary Fund regarding\n" +
        "expenditures on environmental policies by different countries. Users can evaluate the amount that governments are spending on climate policy in their local currencies.");
        break;
      default:
        setPreview("");
        break;
    }
  };

  return (
    <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
      <h2>Welcome!</h2>
      <p className="longtext">
        {" "}
        Environmental issues such as climate change and invasive species
        introductions have had increasingly significant impacts not only on the
        natural world, but on the economy, politics, and human society.
        Understanding the extent to which communities are prepared to address
        existing risks brought about by these factors has become just as
        important as extrapolating how these factors are likely to evolve in the
        years to come. This application is thus centered on the general theme of
        “climate resilience”, an increasingly popular term encompassing the
        ability of different entities to adapt to modern environmental
        challenges.{" "}
      </p>
      <p className="longtext">
        {" "}
        Users are invited to explore five distinct dashboards examining severe
        weather, human health and temperature, invasive species burdens on
        agriculture, property value and precipitation, etc.. On each page, trends
        in these topics can be examined over time
        and plotted as curves on different graphs. Users have the flexibility to
        select different geographic locations, taxa, agricultural commodities,
        causes of death, etc. depending on the target graph, as well as to
        select different time scales to refine their questions. Our intention is
        that the application prove valuable to policymakers who must assess
        where additional action needs to be targeted and which communities may
        act as effective models when it comes to preserving the health and
        prosperity of citizens amidst climate and ecological disasters.
      </p>
      <hr style={{ borderTop: "3px solid #bbb" }}></hr>
      <div>
        <button onClick={() => showPreview("Severe Weather")}>
          Severe Weather Summary
        </button>
        <button onClick={() => showPreview("Temperature-Dependent Mortality")}>
          Mortality Summary
        </button>
        <button onClick={() => showPreview("Insect Diversity")}>
          Insect Diversity Summary
        </button>
        <button onClick={() => showPreview("Invasive Insects")}>
          Invasive Insects Summary
        </button>
        <button onClick={() => showPreview("Housing Index")}>
          Housing Index Summary
        </button>
        <button onClick={() => showPreview("Government Spending")}>
          Government Spending Summary
        </button>
      </div>
      {preview && <p>{preview}</p>}
      <hr style={{ borderTop: "3px solid #bbb" }}></hr>
      <p className="longtext">
        {" "}
        The data for this project has been derived from several publically
        available datasets published by various agencies of the U.S. government,
        among other sources. More detail on each source is provided on the
        preview slides. The total number of
        tuples assimilated into the database can be obtained using the button
        below.{" "}
      </p>
      <button onClick={() => totalTupleGetter()}>
        {" "}
        Fetch Total Number of Tuples
      </button>
    </div>
  );
}

export default OverviewPage;
