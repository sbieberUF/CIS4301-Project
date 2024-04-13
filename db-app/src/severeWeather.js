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

function SevereWeatherTab() {
  const [options, setOptions] = useState({
    stateCounty: "ALL",
    stormEvent: "ALL",
    startDate: "1950-01-01",
    endDate: "2023-12-31",
    resolution: "By Year",
    minAge: 0,
    maxAge: 103,
    sex: "ALL",
    fatalityType: "ALL",
  });
  const [data1, setData1] = useState(null);
  // Mock data for right now
  //fix these two
  const eventTypes = ["ALL", "Thunderstorm Wind", "Hail"];
  const states = ["ALL", "State1", "State2", "State3"];

  const resolution = ["By Year", "By Month"];
  const sex = ["ALL", "M", "F"];
  const fatalityType = ["ALL", "D", "I"];

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
  //generate the individual lines
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
        />
      );
    });
  };
  const generateGraph = async (options) => {
    //format the string
    var timeformat = "YYYY-MM";
    if (options.resolution === "By Year") {
      timeformat = "YYYY";
    }
    var conditions = "";
    if (options.stateCounty !== "ALL") {
      if (conditions.length === 0) {
      }
      conditions = `WHERE st.SNAME = '${options.stateCounty}'`;
    }
    if (options.stormEvent !== "ALL") {
      if (conditions.length === 0) {
        conditions = "WHERE ";
      }
      conditions = `${conditions}EVENT_TYPE = '${options.stormEvent}'`;
    }
    var queryText1 = `WITH dates(yearMonth) AS (
      SELECT to_char(BEGIN_DATE_TIME,'${timeformat}') FROM "JASON.LI1".STORM_EVENT 
      WHERE BEGIN_DATE_TIME >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
      AND BEGIN_DATE_TIME <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
      GROUP BY to_char(BEGIN_DATE_TIME,'${timeformat}')
  ),
  eventList(yearMonth) AS (
      SELECT to_char(BEGIN_DATE_TIME,'${timeformat}') FROM "JASON.LI1".STORM_EVENT se
      INNER JOIN "JASON.LI1".STORM_LOC sl ON se.EVENT_ID = sl.EVENT_ID
      INNER JOIN "JASON.LI1".STATES st ON st.FIPS = sl.STATE_FIPS
      ${conditions}
  )
  SELECT dates.yearMonth, COUNT(eventList.yearMonth) FROM dates 
  LEFT JOIN eventList ON eventList.yearMonth = dates.yearMonth 
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
          Select Event Type:
          <select
            name="stormEvent"
            value={options.stormEvent}
            onChange={handleChange}
          >
            {eventTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select State:
          <select
            name="stateCounty"
            value={options.stateCounty}
            onChange={handleChange}
          >
            {states.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          <u>Select Date Range</u>
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
        <br />
        <label>
          Data Point Resolution:
          <select
            name="resolution"
            value={options.resolution}
            onChange={handleChange}
          >
            {resolution.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <br />
      </div>
      <div>
        <h3>Fatality Settings</h3>
        <label>
          <u>Age Range: </u>{" "}
        </label>
        <br />
        <label>
          Minimum Age:{" "}
          <input
            type="number"
            id="minAge"
            name="minAge"
            min="0"
            max="103"
            value={options.minAge}
            onChange={handleChange}
          />
          <br />
          Maximum Age:{" "}
          <input
            type="number"
            id="maxAge"
            name="maxAge"
            min="0"
            max="103"
            value={options.maxAge}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Sex:
          <select name="sex" value={options.sex} onChange={handleChange}>
            {sex.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Fatality Type: {"(D) = Direct; (I) = Indirect"}
          <br />
          <select
            name="fatalityType"
            value={options.fatalityType}
            onChange={handleChange}
          >
            {fatalityType.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
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

export default SevereWeatherTab;
