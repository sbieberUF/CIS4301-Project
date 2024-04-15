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

function SimpsonTab() {
  const [options, setOptions] = useState({
    state: [],
    county: [],
    dateInterval: "Daily",
    startDate: "2014-01-01",
    endDate: "2024-03-24",
    order: [],
    family: [],
    genus: [],
  });

  const [data1, setData1] = useState([]);
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
    } else {
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

  const clearCharts = () => {
    setData1([]);
  }

  const transformDataForRecharts = (input) => {
    const data = {};
    if (!(Object.is(input[0], null))) {
      input.forEach(item => {
        const { dataarray, lilid } = item;
        dataarray.forEach(({ date, datakey }) => {
          if (!data[date]) {
            data[date] = { date };
          }
          data[date][lilid] = datakey;
        });
      });
    }
    // Convert object to array for Recharts compatibility
    return Object.values(data);
  }

  const generateGraph = async (options) => {
    //format the string
    var optionString1 = ``;
    var timeformat = `observationdate, 'YYYY-MM-DD'`;
    if (options.dateInterval === "Monthly") {
      timeformat = `ROUND(observationdate, 'MONTH'), 'YYYY-MM'`;
    }
    else if (options.dateInterval === "Yearly") {
      timeformat = `ROUND(observationdate, 'YEAR'), 'YYYY'`;
    }
    else if (options.dateInterval === "Every Five Years") {
      timeformat = `(ROUND(TO_NUMBER(TO_CHAR(observationdate, 'YYYY'))/5)) * 5`;
    }
    var conditions = "";
    if (options.state.length !== 0 && !options.state.includes('All') ) {
      optionString1 += `State: ${options.state}; `;
      for (let i in options.state) {
        if (i > 0) {
          conditions = `${conditions} OR obsstate = '${options.state[i]}'`;
        } else {
          conditions = `WHERE (obsstate = '${options.state[i]}'`;
        }
        if (options.county.length !== 0 && !options.county.includes('All')) {
          optionString1 += `County: ${options.county}; `;
          for (let i in options.county) {
            if (i > 0) {
              conditions = `${conditions} OR obscounty = '${options.county[i]}'`
            } else {
              conditions += ` AND (obscounty = '${options.county[i]}'`;
            }
          }
          conditions += ')';
        }
      }
      conditions += ')';
    }
    if (options.order.length !== 0 && !options.order.includes('All')) {
      optionString1 += `Order: ${options.order}; `;
      for (let i in options.order) {
        if (i > 0) {
          conditions += ` OR insect_order = '${options.order[i]}'`;
        } else {
          conditions += ` AND (insect_order = '${options.order[i]}'`;
        }
      }
      if (options.family.length !== 0 && !options.family.includes('All')) {
        optionString1 += `Family: ${options.family}; `;
        for (let i in options.family) {
          conditions += ` OR family = '${options.family[i]}'`;
          }
        if (options.genus.length !== 0 && !options.genus.includes('All')) {
          optionString1 += `Genus: ${options.genus}; `;
          for (let i in options.genus) {
            conditions += ` OR genus = '${options.genus[i]}'`;
          }
        }
      }
      conditions += ')';
    }
    optionString1 = optionString1.slice(0, -2);
    
    var queryText1 = `WITH dates(dateIntervals) AS (
        SELECT TO_CHAR(${timeformat}) FROM "MIRANDABARNES".observation 
          WHERE observationdate >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
          AND observationdate <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
          GROUP BY TO_CHAR(${timeformat})
        ),
        numberOfSpeciesObservedPerDate(dateIntervals, species, speciesCount) AS (
          SELECT TO_CHAR(${timeformat}), obsspecies, COUNT(obsid)
              FROM "MIRANDABARNES".observation JOIN "MIRANDABARNES".insect ON observation.obsspecies = insect.species_name
              ${conditions}
              GROUP BY TO_CHAR(${timeformat}), obsspecies
        ),
        totalObservations(dateIntervals, totalCount) AS (
          SELECT TO_CHAR(${timeformat}), COUNT(obsid)
              FROM "MIRANDABARNES".observation JOIN "MIRANDABARNES".insect ON observation.obsspecies = insect.species_name
              ${conditions}
              GROUP BY TO_CHAR(${timeformat})
        ),
        numeratorTab(dateIntervals, numerator) AS (
          SELECT dateIntervals, SUM((speciesCount) * (speciesCount - 1))
              FROM numberOfSpeciesObservedPerDate
              GROUP BY dateIntervals
        ),
        denominatorTab(dateIntervals, denominator) AS (
          SELECT dateIntervals, ((totalCount) * (totalCount - 1))
              FROM totalObservations
        ),
        simpsonsIndex(dateIntervals, indexValue) AS (
          SELECT denominatorTab.dateIntervals, ROUND(numerator / denominator, 5)
              FROM numeratorTab JOIN denominatorTab ON numeratorTab.dateIntervals = denominatorTab.dateIntervals
              WHERE denominator != 0
        )
          SELECT dates.dateIntervals, indexValue
              FROM dates LEFT OUTER JOIN simpsonsIndex ON dates.dateIntervals = simpsonsIndex.dateIntervals
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
        for (let i in response.data) {
          dataParsed1.push({
            date: response.data[i][0],
            datakey: response.data[i][1],
          });
        }
        setData1(prevHistory => [...prevHistory, {dataarray: dataParsed1, lilid: optionString1}]);
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
          onClick={() => {generateGraph(options);}}
        >
          Generate Graphs
        </button>
        <br />
        <button
          onClick={() => {clearCharts();}}
        >
          Clear Graphs
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
          <div style={{ alignContent: "center" }}>
            <h2>Diversity By Location Over Time</h2>
            <br />
            <div style={{ display: "inline-block" }}>
              <LineChart
                width={800}
                height={500}
                data={transformDataForRecharts(data1)}
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
                  value={"Simpson's Index"} />
                </YAxis>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="bottom"
                  height={36}
                />
                {data1.map(({ lilid }) => (
                  <Line
                    key={lilid}
                    type="monotone"
                    dataKey={lilid}
                    stroke={getRandomColor()}
                    dot={false}
                  />
                  ))}
                </LineChart>
            </div>
        </div>
    </div>
    <br />
  </div>
  );
}
export default SimpsonTab;
