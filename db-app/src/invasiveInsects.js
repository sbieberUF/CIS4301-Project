import React, { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
} from "recharts";
import axios from "axios";

function InvasiveInsectsTab() {
  const [options, setOptions] = useState({
    state: ['All'],
    county: ['All'],
    dateInterval: ["Yearly"],
    startDate: ["1924-01-01"],
    endDate: ["2024-03-24"],
    order: ["All"],
    family: ["All"],
    genus: ["All"],
    dataType: ["inventory_change_value"],
    incomeCategory: ["All commodities"]
  });

  const [data1, setData1] = useState(null);
  // Mock data for right now 
  const states = ['All', 'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  const [counties, setCounties] = useState(['All']);
  const populateCounties= async () => {
    var startingCounties = ['All'];
    if (options.state !== "All") {
    var countyQuery = `SELECT DISTINCT obscounty FROM "MIRANDABARNES".counties
    WHERE obsstate = '${options.state}'
    ORDER BY obscounty`;
    axios
    .get(`http://localhost:5001/?query=${encodeURIComponent(countyQuery)}`, {
      crossdomain: true,
    })
    .then((response) => {
      console.log(response.data);
      // Logic for generating the graph based on selected data
      console.log("Generating graph...");
      //fetch data with the custom query and format it like the below
      //must be ordered by date, since dates cannot be sorted by recharts
      for (let i in response.data) {
        startingCounties.push(response.data[i]);
      }
      setCounties(startingCounties);
  })}
  else {setCounties(['All'])}};
  const dateIntervals = ["Daily", "Monthly", "Yearly", "Every Five Years"];
  const orders = [
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
  const families = ["All"];
  const dataTypes = ["inventory_change_value", "cash_receipt", "intermediate_product_expense"];
  const incomeCategories = ["All crops", "Animals and products", "All commodities"];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(options);
    setOptions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  
  const getRandomColor = () => {
    return (
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
    );
  };
  
  const lines = () => {
    const entries = data1.map((option) => {
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
      console.log(key);
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
    if (options.dateInterval === "Monthly") {
      timeformat = `ROUND(observationdate, 'MONTH'), 'YYYY-MM'`;
    }
    else if (options.dateInterval === "Yearly") {
      timeformat = `ROUND(observationdate, 'YEAR'), 'YYYY'`
    }
    else if (options.dateInterval === "Every Five Years") {
      timeformat = `(ROUND(TO_NUMBER(TO_CHAR(observationdate, 'YYYY'))/5)) * 5`
    }
    var conditions = "WHERE origin = 'invasive'";
    if (options.state !== 'All') {
      if (conditions.length === 0) {
      }
      conditions = `WHERE obsstate = '${options.state}'`;
      if (options.county !== 'All') {
        conditions += ` AND obscounty = '${options.county}'`
      }
    }
    if (options.order !== 'All') {
      if (conditions.length === 0) {
        conditions = `WHERE insect_order = '${options.order}'`;
      }
      else {
        conditions += ` AND insect_order = '${options.order}'`;
      }
    }
    var queryText1 = `WITH dates(dateIntervals) AS (
      SELECT TO_CHAR(${timeformat}) FROM "MIRANDABARNES".observation 
      WHERE observationdate >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
      AND observationdate <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
      GROUP BY TO_CHAR(${timeformat})
  ),
  observationlist(dateIntervals) AS (
      SELECT TO_CHAR(${timeformat}) FROM "MIRANDABARNES".observation obs
      INNER JOIN "MIRANDABARNES".insect ins ON obs.obsspecies = ins.species_name
      ${conditions}
  )
  SELECT dates.dateIntervals, COUNT(observationlist.dateIntervals) FROM dates 
  LEFT JOIN observationlist ON observationlist.dateIntervals = dates.dateIntervals
  GROUP BY dates.dateIntervals ORDER BY dates.dateIntervals`;
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
        var dataParsed = [];
        for (let i in response.data) {
          dataParsed.push({
            date: response.data[i][0],
            eventFrequency: response.data[i][1],
          });
        }
        setData1(dataParsed);
      });
  };

  return (
    <div>
      <h2>Select Criteria</h2>
      <div>
        <h3>General</h3>
        <label>
          Select State:
          <select name="state" value={options.state} onBlur={populateCounties} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select County:
          <select name="county" value={options.county} onChange={handleChange}>
            <option value="">Select County</option>
            {counties.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Date Interval:
          <select name="dateInterval" value={options.dateInterval} onChange={handleChange}>
            <option value="">Pick Intervals</option>
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
          <select name="dataType" value={options.dataType} onChange={handleChange}>
            <option value="">Select Income Data Type</option>
            {dataTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Category:
          <select name="incomeCategory" value={options.incomeCategory} onChange={handleChange}>
            <option value="">Select Category</option>
            {incomeCategories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <h3>Insect Observations</h3>
        <label>
          Select Order:
          <select name="order" value={options.order} onChange={handleChange}>
            <option value="">Select Order</option>
            {orders.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Family:
          <select name="family" value={options.family} onChange={handleChange}>
            <option value="">Select Taxa</option>
            {families.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <hr style={{ margin: "20px 0" }} />
      <button
        onClick={() => {
          generateGraph(options);
        }}
      >
        Generate Graphs
      </button>
      {data1 && (
        <LineChart
          width={500}
          height={400}
          data={data1}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="top"
            align="right"
            height={36}
          />
          {lines()}
        </LineChart>
      )}
      {data1 && (
        <LineChart
          width={500}
          height={400}
          data={data1}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="top"
            align="right"
            height={36}
          />
          {lines()}
        </LineChart>
      )}
    </div>
  );
}

export default InvasiveInsectsTab;
