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
    state: ["ALL"],
    county: ["ALL"],
    dateInterval: ["Yearly"],
    startDate: ["1924-01-01"],
    endDate: ["2024-03-24"],
    taxonLevel: ["ALL"],
    taxon: ["ALL"],
    dataType: ["inventory_change_value"],
    incomeCategory: ["All commodities"]
  });

  const [data1, setData1] = useState(null);;
  // Mock data for right now 
  const states = ["Florida", "Virginia"];
  const counties = ["Alachua", "Montgomery"];
  const startDates = ["1924-01-01"];
  const endDates = ["2024-03-24"];
  const dateIntervals = ["Monthly", "Yearly", "Every Five Years"];
  const taxonLevels = ["Order", "Family", "Genus"];
  const taxa = ["ALL", "Lepidoptera", "Diptera"];
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
    var timeformat = "YYYY-MM";
    if (options.dateInterval === "Yearly") {
      timeformat = "YYYY";
    }
    var conditions = "";
    if (options.state !== "ALL") {
      if (conditions.length === 0) {
      }
      // conditions = `WHERE obsstate = '${options.state}'`;
    }
    if (options.taxon !== "ALL") {
      if (conditions.length === 0) {
       // conditions = "WHERE ";
      }
      // conditions = `${conditions}ORDER = '${options.taxon}'`;
    }
    var queryText1 = `WITH dates(yearMonth) AS (
      SELECT to_char(observationdate,'${timeformat}') FROM "MIRANDABARNES".observation 
      WHERE observationdate >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
      AND observationdate <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
      GROUP BY to_char(observationdate,'${timeformat}')
  ),
  observationlist(yearMonth) AS (
      SELECT to_char(observationdate,'${timeformat}') FROM "MIRANDABARNES".observation obs
      INNER JOIN "MIRANDABARNES".insect ins ON obs.obsspecies = ins.species_name
      ${conditions}
  )
  SELECT dates.yearMonth, COUNT(observationlist.yearMonth) FROM dates 
  LEFT JOIN observationlist ON observationlist.yearMonth = dates.yearMonth 
  GROUP BY dates.yearMonth ORDER BY dates.yearMonth`;
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
          <select name="state" value={options.state} onChange={handleChange}>
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
            <option value="">Intervals</option>
            {dateIntervals.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Start Date:
          <select name="startDate" value={options.startDate} onChange={handleChange}>
            <option value="">Start Date</option>
            {startDates.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select End Date:
          <select name="endDate" value={options.endDate} onChange={handleChange}>
            <option value="">End Date</option>
            {endDates.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
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
          Select Taxon Level:
          <select name="taxonLevel" value={options.taxonLevel} onChange={handleChange}>
            <option value="">Select Taxon Level</option>
            {taxonLevels.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Taxa:
          <select name="taxa" value={options.taxa} onChange={handleChange}>
            <option value="">Select Taxa</option>
            {taxa.map((option) => (
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
