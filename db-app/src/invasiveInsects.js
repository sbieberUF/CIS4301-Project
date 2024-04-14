import React, { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Label
} from "recharts";
import axios from "axios";

function InvasiveInsectsTab() {
  const [options, setOptions] = useState({
    state: [],
    county: [],
    dateInterval: "Daily",
    startDate: "2014-01-01",
    endDate: "2024-03-24",
    order: [],
    family: [],
    genus: [],
    dataType: '',
    incomeCategory: []
  });

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);
  // Mock data for right now 
  const states = ['All', 'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  const [counties, setCounties] = useState([]);
  const populateCounties= async () => {
    setCounties(["Loading..."]);
    var startingCounties = [];
    var countyQuery = `SELECT DISTINCT obscounty FROM "MIRANDABARNES".counties
    WHERE obsstate = '${options.state[options.state.length - 1]}'
    ORDER BY obscounty`;
    axios
    .get(`http://localhost:5001/?query=${encodeURIComponent(countyQuery)}`, {
      crossdomain: true,
    })
    .then((response) => {
      console.log(response.data);
      for (let i in response.data) {
        startingCounties.push(response.data[i]);
      }
      setCounties(startingCounties);})
  };
  const dateIntervals = ["Daily", "Monthly", "Yearly", "Every Five Years"];
  const orders = ['All',
    "Blattodea",
    "Coleoptera",
    "Dermaptera",
    "Diptera",
    "Ephemeroptera",
    "Hemiptera",
    "Hymenoptera",
    "Lepidoptera",
    "Mantodea",
    "Odonata",
    "Orthoptera",
    "Siphonaptera",
    "Thysanoptera",
];
  const [families, setFamilies] = useState([]);
  const populateFamilies = async () => {
    setFamilies(["Loading..."]);
    var startingFamilies = [];
    var familyQuery = `SELECT DISTINCT family FROM "MIRANDABARNES".insect
    WHERE insect_order = '${options.order[options.order.length - 1]}' ORDER BY family`;
    axios
    .get(`http://localhost:5001/?query=${encodeURIComponent(familyQuery)}`, {
      crossdomain: true,
    })
    .then((response) => {
      console.log(response.data);
      for (let i in response.data) {
        startingFamilies.push(response.data[i]);
      }
      setFamilies(startingFamilies);
    })
    setGenera([])};

  const [genera, setGenera] = useState([])
  const populateGenera = async () => {
    setGenera(["Loading..."]);
    var startingGenera = [];
    var genusQuery = `SELECT DISTINCT genus FROM "MIRANDABARNES".insect
    WHERE family = '${options.family[options.family.length - 1]}' ORDER BY genus`;
    axios
    .get(`http://localhost:5001/?query=${encodeURIComponent(genusQuery)}`, {
      crossdomain: true,
    })
    .then((response) => {
      console.log(response.data);
      for (let i in response.data) {
        startingGenera.push(response.data[i]);
      }
      setGenera(startingGenera);
  })};

  const dataTypes = ["Cash Receipts", "Inventory Change", "Intermediate Product Expenses"];

  const [incomeCategories, setIncomeCategories] = useState([]);
  const populateCategories = async () => {
    setIncomeCategories(["Loading..."]);
    var startingCat = [];
    var catQuery = '';
    if (options.dataType === "Cash Receipts") {
      catQuery = `SELECT DISTINCT commodity FROM "MIRANDABARNES".cash_receipt ORDER BY commodity`;
    }
    else if (options.dataType === "Inventory Change") {
      catQuery = `SELECT DISTINCT sector FROM "MIRANDABARNES".inventory_change_value ORDER BY sector`
    }
    else if (options.dataType === "Intermediate Product Expenses") {
      catQuery = `SELECT DISTINCT ip_category FROM "MIRANDABARNES".intermediate_product_expense ORDER BY ip_category`
    }
    axios
    .get(`http://localhost:5001/?query=${encodeURIComponent(catQuery)}`, {
      crossdomain: true,
    })
    .then((response) => {
      console.log(response.data);
      for (let i in response.data) {
        startingCat.push(response.data[i]);
      }
      setIncomeCategories(startingCat);
  })}
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "-----------") {
      return;
    }
    if (name === "state") {
      if (options.state.includes(value)) {
        return;
      }
      if (value === 'All') {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      var arr = options.state;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "order") {
      if (options.order.includes(value)) {
        return;
      }
      if (value === 'All') {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      arr = options.order;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "county") {
      if (options.county.includes(value)) {
        return;
      }
      if (value === 'All') {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      arr = options.county;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "family") {
      if (options.family.includes(value)) {
        return;
      }
      if (value === 'All') {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      arr = options.family;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "genus") {
      if (options.genus.includes(value)) {
        return;
      }
      if (value === 'All') {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      arr = options.genus;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "incomeCategory") {
      if (options.incomeCategory.includes(value)) {
        return;
      }
      if (value === 'All') {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      arr = options.incomeCategory;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "dataType") {
      setOptions((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      options.incomeCategory = [];
    }  else {
      setOptions((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } 
  };

  const removeSelectedItem = (nm, value) => {
    setOptions((prevState) => ({
      ...prevState,
      [nm]: options[nm].filter((item) => item !== value),
    }));
  };
  
  const getRandomColor = () => {
    return (
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
    );
  };
  
  const lines = (dataset) => {
    const entries = dataset.map((option) => {
      const keys = Object.keys(option);
      return keys;
    });
    const flattened = entries.reduce((prev, current) => {
      prev = prev.concat(current);
      return prev;
    }, []);
    const filtered = flattened.filter((key) => key !== "date");
    const uniqueKeys = [...new Set(filtered)];
    return uniqueKeys.map((key) => {
      return (
        <Line
          name={key}
          type="monotone"
          stroke={getRandomColor()}
          dataKey={key}
          dot={false}
        />
      );
    });
  };

  const generateGraph = async (options) => {
    //format the string
    var timeformat = `observationdate, 'YYYY-MM-DD'`;
    var timeformatag = `year`;
    if (options.dateInterval === "Monthly") {
      timeformat = `ROUND(observationdate, 'MONTH'), 'YYYY-MM'`;
    }
    else if (options.dateInterval === "Yearly") {
      timeformat = `ROUND(observationdate, 'YEAR'), 'YYYY'`;
    }
    else if (options.dateInterval === "Every Five Years") {
      timeformat = `(ROUND(TO_NUMBER(TO_CHAR(observationdate, 'YYYY'))/5)) * 5`;
      timeformatag = `(ROUND(year / 5)) * 5`;
    }
    var conditions = "";
    var invasiveconditions = `WHERE origin = 'invasive'`;
    var agtable = 'cash_receipt';
    var agconditions = `WHERE commodity = 'All Commodities-All'`;
    var aglocconditions = '';
    if (options.state.length !== 0 && !options.state.includes('All') ) {
      for (let i in options.state) {
        if (i > 0) {
          conditions = `${conditions} OR obsstate = '${options.state[i]}'`;
          invasiveconditions = `${invasiveconditions} OR obsstate = '${options.state[i]}'`;
          aglocconditions = `${aglocconditions} OR state_name = '${options.state[i]}'`;
        } else {
          conditions = `WHERE (obsstate = '${options.state[i]}'`;
          invasiveconditions += ` AND (obsstate = '${options.state[i]}'`;
          aglocconditions += ` AND (state_name = '${options.state[i]}'`;
        }
        if (options.county.length !== 0 && !options.county.includes('All')) {
          for (let i in options.county) {
            if (i > 0) {
              conditions = `${conditions} OR obscounty = '${options.county[i]}'`
              invasiveconditions = `${invasiveconditions} OR obscounty = '${options.county[i]}'`
            } else {
              conditions += ` AND (obscounty = '${options.county[i]}'`;
              invasiveconditions += ` AND (obscounty = '${options.county[i]}'`;
            }
          }
          conditions += ')';
          invasiveconditions += ')';
        }
      }
      conditions += ')';
      invasiveconditions += ')';
      aglocconditions += ')';
    }
    if (options.order.length !== 0 && !options.order.includes('All')) {
      for (let i in options.order) {
        if (i > 0) {
          invasiveconditions += ` OR insect_order = '${options.order[i]}'`;
        } else {
          invasiveconditions += ` AND (insect_order = '${options.order[i]}'`;
        }
      }
      if (options.family.length !== 0 && !options.family.includes('All')) {
        for (let i in options.family) {
          invasiveconditions += ` OR family = '${options.family[i]}'`;
          }
        if (options.genus.length !== 0 && !options.genus.includes('All')) {
          for (let i in options.genus) {
            invasiveconditions += ` OR genus = '${options.genus[i]}'`;
          }
        }
      }
      invasiveconditions += ')';
    }

    if (options.dataType === "Cash Receipts" && !options.incomeCategory.includes('All Commodities-All')) {
      agconditions = `WHERE commodity = '${options.incomeCategory[0]}'`;
    }
    else if (options.dataType === "Inventory Change") {
      agtable = 'inventory_change_value';
      if (agconditions !== '' && !options.incomeCategory.includes('All commodities')) {
        agconditions = `WHERE sector = '${options.incomeCategory[0]}'`;
      }
      else {
        agconditions = `WHERE sector = 'All commodities'`
      }
    }
    else if (options.dataType === "Intermediate Product Expenses") {
      agtable = 'intermediate_product_expense'
      for (let i in options.incomeCategory) {
        if (i > 0) {
          agconditions += ` OR ip_category = '${options.incomeCategory[i]}'`;
        } else {
          agconditions = `WHERE ip_category = '${options.incomeCategory[i]}'`;
        }
      }
      if (!agconditions.includes('WHERE')) {
        agconditions = `WHERE ip_category != ''`;
      }
    }

    
    var queryText1 = `WITH dates(dateIntervals) AS (
      SELECT TO_CHAR(${timeformat}) FROM "MIRANDABARNES".observation 
        WHERE observationdate >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
        AND observationdate <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
        GROUP BY TO_CHAR(${timeformat})
      ),
      invasiveobservationlist(dateIntervals) AS (
        SELECT TO_CHAR(${timeformat}) FROM "MIRANDABARNES".observation obs
        INNER JOIN "MIRANDABARNES".insect ins ON obs.obsspecies = ins.species_name
        ${invasiveconditions}
      ),
      allobservationlist(dateIntervals) AS (
        SELECT TO_CHAR(${timeformat}) FROM "MIRANDABARNES".observation obs
        INNER JOIN "MIRANDABARNES".insect ins ON obs.obsspecies = ins.species_name
        ${conditions}
      ),
      invasivescount(dateIntervals, invCount) AS (
        SELECT invasiveobservationlist.dateIntervals, COUNT(invasiveobservationlist.dateIntervals)
        FROM invasiveobservationlist
      GROUP BY invasiveobservationlist.dateIntervals
      ),
      allcount(dateIntervals, aCount) AS (SELECT allobservationlist.dateIntervals, COUNT(allobservationlist.dateIntervals)
        FROM allobservationlist
        GROUP BY allobservationlist.dateIntervals
      ),
      normalized(dateIntervals, normCount) AS (SELECT invasivescount.dateIntervals, ROUND(invCount / aCount * 1000, 3)
        FROM invasivescount JOIN allcount ON invasivescount.dateIntervals = allcount.dateIntervals
        WHERE invasivescount.dateIntervals IS NOT NULL
      ),
      agdatabystate(year, summedData) AS (
        SELECT year,  ( SUM(value) / (gdp_deflator / 100) )
            FROM ${agtable}
            ${agconditions}${aglocconditions}
            GROUP BY year, gdp_deflator
      ),
      agdatalist(modDateIntervals, agcriterion) AS (
        SELECT TO_CHAR(${timeformatag}), ROUND(AVG(summedData))
            FROM agdatabystate
            GROUP BY TO_CHAR(${timeformatag})
      ),
      normalagcombo(dateIntervals, dollarperinvasive) AS (
        SELECT normalized.dateIntervals, ROUND(agcriterion / normCount, 2)
          FROM normalized JOIN agdatalist ON SUBSTR(normalized.dateIntervals, 1, 4) = agdatalist.modDateIntervals
      )
    SELECT dates.dateIntervals, normCount, agcriterion, dollarperinvasive
        FROM dates LEFT OUTER JOIN normalized on dates.dateIntervals = normalized.dateIntervals LEFT OUTER JOIN agdatalist ON
            SUBSTR(dates.dateIntervals, 1, 4) = agdatalist.modDateIntervals LEFT OUTER JOIN normalagcombo on dates.dateIntervals = normalagcombo.dateIntervals
        ORDER BY dates.dateIntervals`;
    console.log(queryText1);
    axios
      .get(`http://localhost:5001/?query=${encodeURIComponent(queryText1)}`, {
        crossdomain: true,
      })
      .then((response) => {
        console.log(response.data);
        // Logic for generating the graph based on selected data
        console.log("Generating graph...");
        //fetch data with the custom query and format it like the below
        //must be ordered by date, since dates cannot be sorted by recharts
        var dataParsed1 = [];
        var dataParsed2 = [];
        var dataParsed3 = [];
        for (let i in response.data) {
          dataParsed1.push({
            date: response.data[i][0],
            invasivesPerThousand: response.data[i][1],
          });
          dataParsed2.push({
            date: response.data[i][0],
            usDollars: response.data[i][2],
          });
          dataParsed3.push({
            date: response.data[i][0],
            usDollarsPerNormalizedInvasiveObservation: response.data[i][3],
          });
        }
        setData1(dataParsed1);
        setData2(dataParsed2);
        setData3(dataParsed3);
      });
  };

  return (
    <div style={{ display: "block", paddingBottom: "50px" }}>
      <fieldset
        className="settings"
        style={{
          display: "inline-block",
          width: "25%",
          height: "550px",
          overflowY: "scroll",
        }}
      >
        <legend>Select Criteria</legend>
        <div>
          <h3>General</h3>
          <label>
            Select State:
            <select
              name="state"
              value={
                options.state.length === 0
                  ? "All States (default)"
                  : `Selected ${options.state.length}`
              }
              onChange={handleChange}
              onBlur={populateCounties}
            >
              <option>
                {options.state.length === 0
                  ? "All"
                  : `Selected ${options.state.length}`}
              </option>
              <option value={"-----------"}>{"-----------"} </option>
              {states
                .filter((item, idx) => !options.state.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.state.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("state", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
          <label>
            Select County:
            <select
              name="county"
              value={
                options.county.length === 0
                  ? "All"
                  : `Selected ${options.county.length}`
              }
              onChange={handleChange}
            >
              <option>
                {options.county.length === 0
                  ? "All"
                  : `Selected ${options.county.length}`}
              </option>
              <option value={"-----------"}>{"-----------"} </option>
              {counties
                .filter((item, idx) => !options.county.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
         </label>
         <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.county.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("county", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
          <br />
          <label>
            Select Date Resolution:
            <select name="dateInterval" value={options.dateInterval} onChange={handleChange}>
             <option value="">Select Resolution</option>
              {dateIntervals.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
         <br />
          <label>
           Start Date:
            <input
              type="date"
             id="startDate"
             name="startDate"
             value={options.startDate}
             onChange={handleChange}
             min="1950-01-01"
             max="2023-12-31"
           />
           <br />
           End Date:
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={options.endDate}
              onChange={handleChange}
              min="1950-01-01"
              max="2023-12-31"
            />
          </label>
        </div>
        <div>
          <h3>Farm Income/Expense Data:</h3>
          <label>
            Select Farm Income Data Type:
            <select name="dataType" value={options.dataType} onBlur={populateCategories} onChange={handleChange}>
              <option value="">Select Income Data Type</option>
              {dataTypes.map((option) => (
                <option key={option} value={option}>{option}</option>
             ))}
            </select>
          </label>
          <label>
            Select Category:
            <select
              name="incomeCategory"
              value={
                options.incomeCategory.length === 0
                  ? "All"
                  : `Selected ${options.incomeCategory.length}`
              }
              onChange={handleChange}
            >
              <option>
                {options.incomeCategory.length === 0
                  ? "All"
                  : `Selected ${options.incomeCategory.length}`}
              </option>
              <option value={"-----------"}>{"-----------"} </option>
              {incomeCategories
                .filter((item, idx) => !options.incomeCategory.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.incomeCategory.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("incomeCategory", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>Insect Observations</h3>
          <label>
            Select Order:
            <select
              name="order"
              value={
                options.order.length === 0
                  ? "All"
                  : `Selected ${options.order.length}`
              }
              onChange={handleChange}
              onBlur={populateFamilies}
            >
              <option>
                {options.order.length === 0
                  ? "All"
                  : `Selected ${options.order.length}`}
              </option>
              <option value={"-----------"}>{"-----------"} </option>
              {orders
                .filter((item, idx) => !options.order.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.order.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("order", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
          <label>
            Select Family:
            <select
              name="family"
              value={
                options.family.length === 0
                  ? "All"
                  : `Selected ${options.family.length}`
              }
              onChange={handleChange}
              onBlur={populateGenera}
            >
              <option>
                {options.family.length === 0
                  ? "All"
                  : `Selected ${options.family.length}`}
              </option>
              <option value={"-----------"}>{"-----------"} </option>
              {families
                .filter((item, idx) => !options.family.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.family.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("family", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
          <label>
            Select Genus:
            <select
              name="genus"
              value={
                options.genus.length === 0
                  ? "All"
                  : `Selected ${options.genus.length}`
              }
              onChange={handleChange}
            >
              <option>
                {options.genus.length === 0
                  ? "All"
                  : `Selected ${options.genus.length}`}
              </option>
              <option value={"-----------"}>{"-----------"} </option>
              {genera
                .filter((item, idx) => !options.genus.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.genus.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("genus", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
        </div>
        <hr style={{ margin: "20px 0" }} />
        <button
          onClick={() => {
            generateGraph(options);
          }}
        >
          Generate Graphs
        </button>
      </fieldset>
      <div
        className="graphs"
        style={{
          display: "inline-block",
          width: "70%",
          height: "550px",
          overflowY: "scroll",
        }}
      >
        {data1 && (
          <div style={{ alignContent: "center" }}>
            <h2>Normalized Invasive Species Observations (Per Thousand Insects)</h2>
            <br />
            <div style={{ display: "inline-block" }}>
              <LineChart
                width={800}
                height={500}
                data={data1}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 75,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin", "dataMax"]}>
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "130%",
                    fill: "black",
                  }}
                  position={"left"}
                  offset={20}
                  angle={270} 
                  value={"Invasive Insects Per Thousand Observations"} />
                </YAxis>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="top"
                  align="right"
                  height={36}
                />
                {lines(data1)}
              </LineChart>
            </div>
          </div>
        )}
        {data2 && (
          <div style={{ alignContent: "center" }}>
            <h2>Farm Financial Data</h2>
            <br />
            <div style={{ display: "inline-block" }}>
              <LineChart
                width={800}
                height={500}
                data={data2}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 75,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin", "dataMax"]}>
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "130%",
                    fill: "black",
                  }}
                  position={"left"}
                  offset={20}
                  angle={270} 
                  value={"US Dollars"} />
                </YAxis>
              <Tooltip />
              <Legend
                layout="vertical"
                verticalAlign="top"
                align="right"
                height={36}
              />
              {lines(data2)}
            </LineChart>
          </div>
        </div>
      )}
      {data3 && (
        <div style={{ alignContent: "center" }}>
          <h2>Dollars Per Normalized Observation</h2>
          <br />
          <div style={{ display: "inline-block" }}>
            <LineChart
              width={800}
              height={500}
              data={data3}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 75,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin", "dataMax"]}>
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "130%",
                    fill: "black",
                  }}
                  position={"left"}
                  offset={20}
                  angle={270} 
                  value={"Dollars Per Normalized Observation"} />
                </YAxis>
              <Tooltip />
              <Legend
                layout="vertical"
                verticalAlign="top"
                align="right"
                height={36}
              />
              {lines(data3)}
            </LineChart>
          </div>
        </div>
      )}
    </div>
    <br />
  </div>
  );
}

export default InvasiveInsectsTab;
