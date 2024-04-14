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
    state: 'All',
    county: 'All',
    dateInterval: "Daily",
    startDate: "1924-01-01",
    endDate: "2024-03-24",
    order: 'All',
    family: 'All',
    genus: 'All',
    dataType: "inventory_change_value",
    incomeCategory: "All commodities"
  });

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);
  // Mock data for right now 
  const states = ['All', 'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  const [counties, setCounties] = useState(['All']);
  const populateCounties= async () => {
    var startingCounties = ['All'];
    if (options.state !== 'All') {
    var countyQuery = `SELECT DISTINCT obscounty FROM "MIRANDABARNES".counties
    WHERE obsstate = '${options.state}'
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
      setCounties(startingCounties);
  })}
  else {setCounties(['All'])}};
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
  const [families, setFamilies] = useState(['All']);
  const populateFamilies = async () => {
    var startingFamilies = ['All'];
    if (options.order !== 'All' && options.order !== '') {
    var familyQuery = `SELECT DISTINCT family FROM "MIRANDABARNES".insect
    WHERE insect_order = '${options.order}' ORDER BY family`;
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
  })}};
  const [genera, setGenera] = useState(['All'])
  const populateGenera = async () => {
    var startingGenera = ['All'];
    if (options.family !== 'All' && options.family !== '') {
    var genusQuery = `SELECT DISTINCT genus FROM "MIRANDABARNES".insect
    WHERE family = '${options.family}' ORDER BY genus`;
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
  })}};

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
    if (options.state !== 'All' && options.state !== '') {
      if (conditions.length === 0) {
      }
      conditions = `WHERE obsstate = '${options.state}'`;
      if (options.county !== 'All' && options.county !== '') {
        conditions += ` AND obscounty = '${options.county}'`;
        invasiveconditions += ` AND obscounty = '${options.county}'`;
      }
      invasiveconditions += ` AND obsstate = '${options.state}'`;
    }
    if (options.order !== 'All' && options.order !== '') {
      invasiveconditions += ` AND insect_order = '${options.order}'`;
      if (options.family !== 'All' && options.family !== '') {
        invasiveconditions += ` AND family = '${options.family}'`;
        if (options.genus !== 'All' && options.genus !== '') {
          invasiveconditions += ` AND genus = '${options.genus}'`;
        }
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
      agdatalist(modDateIntervals, agcriterion) AS (
        SELECT TO_CHAR(${timeformatag}), ROUND(AVG( value / (gdp_deflator/100)))
            FROM cash_receipt
            WHERE commodity = 'All Commodities-All'
            GROUP BY TO_CHAR(${timeformatag})
      ),
      normalagcombo(dateIntervals, dollarperinvasive) AS (
        SELECT normalized.dateIntervals, agcriterion / normCount
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
          <select name="order" value={options.order} onBlur={populateFamilies} onChange={handleChange}>
            <option value="">Select Order</option>
            {orders.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Family:
          <select name="family" value={options.family} onBlur={populateGenera} onChange={handleChange}>
            <option value="">Select Family</option>
            {families.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Genus:
          <select name="genus" value={options.genus} onBlur={populateGenera} onChange={handleChange}>
            <option value="">Select Genus</option>
            {genera.map((option) => (
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
          {lines(data1)}
        </LineChart>
      )}
      {data2 && (
        <LineChart
          width={500}
          height={400}
          data={data2}
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
          {lines(data2)}
        </LineChart>
      )}
      {data3 && (
        <LineChart
          width={700}
          height={400}
          data={data3}
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
          {lines(data3)}
        </LineChart>
      )}
    </div>
  );
}

export default InvasiveInsectsTab;
