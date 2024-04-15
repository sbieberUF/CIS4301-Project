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
    stateCounty: [],
    stormEvent: [],
    startDate: "1950-01-01",
    endDate: "2023-12-31",
    resolution: "By Year",
    minAge: 0,
    maxAge: 103,
    fatalityType: "ALL",
    sex: "ALL",
  });
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);
  // Mock data for right now
  //fix these two
  const [eventTypes, setEventTypes] = useState(["ALL"]);
  const [states, setStates] = useState(["ALL"]);

  const resolution = ["By Year", "By Month"];
  const fatalityType = ["ALL", "D", "I"];
  const sex = ["ALL", "M", "F", "UNKNOWN"];
  //loading data into the displays
  if (eventTypes.length === 1) {
    setEventTypes(["Loading...", "..."]);
    axios
      .get(
        `http://localhost:5001/?query=${encodeURIComponent(
          'select EVENT_TYPE FROM "JASON.LI1".STORM_EVENT GROUP BY EVENT_TYPE ORDER BY EVENT_TYPE'
        )}`,
        {
          crossdomain: true,
        }
      )
      .then((response) => {
        //fetch data with the custom query and format it like the below
        //must be ordered by date, since dates cannot be sorted by recharts
        var dataParsed = ["ALL"];
        for (let i in response.data) {
          dataParsed.push(response.data[i]);
        }
        setEventTypes(dataParsed);
      });
  }
  if (states.length === 1) {
    setStates(["Loading...", "..."]);
    axios
      .get(
        `http://localhost:5001/?query=${encodeURIComponent(
          'SELECT SNAME FROM "JASON.LI1".STATES'
        )}`,
        {
          crossdomain: true,
        }
      )
      .then((response) => {
        //fetch data with the custom query and format it like the below
        //must be ordered by date, since dates cannot be sorted by recharts
        var dataParsed = ["ALL"];
        for (let i in response.data) {
          dataParsed.push(response.data[i]);
        }

        setStates(dataParsed);
      });
  }
  const removeSelectedItem = (nm, value) => {
    setOptions((prevState) => ({
      ...prevState,
      [nm]: options[nm].filter((item) => item !== value),
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      value === "-----------" ||
      (data1 &&
        (name === "resolution" || name === "startDate" || name === "endDate"))
    ) {
      return;
    }
    if (name === "stateCounty") {
      if (options.stateCounty.includes(value)) {
        return;
      }
      if (value === "ALL") {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      var arr = options.stateCounty;
      arr.push(value);
      setOptions((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === "stormEvent") {
      if (options.stormEvent.includes(value)) {
        return;
      }
      if (value === "ALL") {
        setOptions((prevState) => ({
          ...prevState,
          [name]: [],
        }));
        return;
      }
      arr = options.stormEvent;
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
  const getRandomColor = () => {
    return "#" + ((Math.random() * 0xffff) << 0).toString(16).padStart(6, "0");
  };
  const clearCharts = () => {
    setData1(null);
    setData2(null);
    setData3(null);
  };
  //generate the individual lines
  const lines = (dat) => {
    const entries = dat.map((option) => {
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
    var timeformat = "YYYY-MM";
    if (options.resolution === "By Year") {
      timeformat = "YYYY";
    }
    var conditions = "";
    if (options.stateCounty.length !== 0) {
      for (let i in options.stateCounty) {
        if (i > 0) {
          conditions = `${conditions} OR st.SNAME = '${options.stateCounty[i]}'`;
        } else {
          conditions = `st.SNAME = '${options.stateCounty[i]}'`;
        }
      }
      conditions = `WHERE (${conditions})`;
    }
    if (options.stormEvent.length !== 0) {
      let eventCondition = "";
      for (let i in options.stormEvent) {
        if (i === "0") {
          eventCondition = `${eventCondition} EVENT_TYPE = '${options.stormEvent[i]}'`;
        } else {
          eventCondition = `${eventCondition} OR EVENT_TYPE = '${options.stormEvent[i]}'`;
        }
      }
      if (conditions.length === 0) {
        conditions = `WHERE (${eventCondition})`;
      } else {
        conditions = `${conditions} AND (${eventCondition})`;
      }
    }
    const queryText1 = `WITH dates(yearMonth) AS (
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
    var stateStats =
      options.stateCounty.length === 0 ? "All" : options.stateCounty.toString();
    var eventStats =
      options.stormEvent.length === 0 ? "All" : options.stormEvent.toString();
    var queryName = `State(s): ${stateStats}; Event(s): ${eventStats}; Ages: ${options.maxAge}-${options.minAge}; Fatality Type: ${options.fatalityType}; Sex: ${options.sex}`;
    axios
      .get(`http://localhost:5001/?query=${encodeURIComponent(queryText1)}`, {
        crossdomain: true,
      })
      .then((response) => {
        //fetch data with the custom query and format it like the below
        //must be ordered by date, since dates cannot be sorted by recharts
        var dataParsed = [];
        if (!data1) {
          for (let i in response.data) {
            dataParsed.push({
              date: response.data[i][0],
              [queryName]: response.data[i][1],
            });
          }
        } else {
          for (let i in response.data) {
            dataParsed.push({
              ...data1[i],
              [queryName]: response.data[i][1],
            });
          }
        }
        setData1(dataParsed);
      });
    //do similar for data 2 and data 3;
    var ftypeANDgender = "";
    if (options.fatalityType !== "ALL") {
      ftypeANDgender = `AND sf.FTYPE = '${options.fatalityType}'`;
    }
    if (options.sex !== "ALL") {
      if (options.sex === "UNKNOWN") {
        ftypeANDgender = `${ftypeANDgender} AND sf.SEX IS NULL`;
      } else {
        ftypeANDgender = `${ftypeANDgender} AND sf.SEX = '${options.sex}'`;
      }
    }
    const queryText2 = `WITH dates(yearMonth) AS (
      SELECT to_char(BEGIN_DATE_TIME,'${timeformat}') FROM "JASON.LI1".STORM_EVENT 
      WHERE BEGIN_DATE_TIME >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
      AND BEGIN_DATE_TIME <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
      GROUP BY to_char(BEGIN_DATE_TIME,'${timeformat}')
  ),
  eventList(yearMonth, event_id) AS (
      SELECT to_char(BEGIN_DATE_TIME,'${timeformat}'), se.EVENT_ID FROM "JASON.LI1".STORM_EVENT se
      INNER JOIN "JASON.LI1".STORM_LOC sl ON se.EVENT_ID = sl.EVENT_ID
      INNER JOIN "JASON.LI1".STATES st ON st.FIPS = sl.STATE_FIPS
      ${conditions}
  ), deathList (yearMonth) AS
  (SELECT el.yearMonth FROM EVENTLIST el INNER JOIN "JASON.LI1".STORM_FATALITY sf ON el.EVENT_ID = sf.EVENT_ID
  WHERE sf.AGE >= ${options.minAge} AND sf.AGE <= ${options.maxAge} ${ftypeANDgender})
  SELECT dates.yearMonth, COUNT(deathList.yearMonth) FROM dates 
  LEFT JOIN deathList ON deathList.yearMonth = dates.yearMonth 
  GROUP BY dates.yearMonth ORDER BY dates.yearMonth`;
    console.log(queryText2);
    axios
      .get(`http://localhost:5001/?query=${encodeURIComponent(queryText2)}`, {
        crossdomain: true,
      })
      .then((response) => {
        //fetch data with the custom query and format it like the below
        //must be ordered by date, since dates cannot be sorted by recharts
        var dataParsed = [];
        if (!data2) {
          for (let i in response.data) {
            dataParsed.push({
              date: response.data[i][0],
              [queryName]: response.data[i][1],
            });
          }
        } else {
          for (let i in response.data) {
            dataParsed.push({
              ...data2[i],
              [queryName]: response.data[i][1],
            });
          }
        }
        setData2(dataParsed);
      });
    //Query 3: average age of deaths
    const queryText3 = `WITH dates(yearMonth) AS (
        SELECT to_char(BEGIN_DATE_TIME,'${timeformat}') FROM "JASON.LI1".STORM_EVENT 
        WHERE BEGIN_DATE_TIME >= to_timestamp('${options.startDate}', 'YYYY-MM-DD')
        AND BEGIN_DATE_TIME <= to_timestamp('${options.endDate}', 'YYYY-MM-DD')
        GROUP BY to_char(BEGIN_DATE_TIME,'${timeformat}')
      ),
      eventList(yearMonth, event_id) AS (
          SELECT to_char(BEGIN_DATE_TIME,'${timeformat}'), se.EVENT_ID FROM "JASON.LI1".STORM_EVENT se
          INNER JOIN "JASON.LI1".STORM_LOC sl ON se.EVENT_ID = sl.EVENT_ID
          INNER JOIN "JASON.LI1".STATES st ON st.FIPS = sl.STATE_FIPS
          ${conditions}
      ), deathList (yearMonth, age) AS (
          SELECT el.yearMonth, sf.age FROM EVENTLIST el 
          INNER JOIN "JASON.LI1".STORM_FATALITY sf ON el.EVENT_ID = sf.EVENT_ID
          WHERE sf.AGE >= ${options.minAge} AND sf.AGE <= ${options.maxAge} ${ftypeANDgender})
      SELECT dates.yearMonth, COALESCE(ROUND(AVG(deathList.age),2), 0) FROM dates 
      LEFT JOIN deathList ON deathList.yearMonth = dates.yearMonth 
      GROUP BY dates.yearMonth ORDER BY dates.yearMonth`;
    console.log(queryText3);
    axios
      .get(`http://localhost:5001/?query=${encodeURIComponent(queryText3)}`, {
        crossdomain: true,
      })
      .then((response) => {
        //fetch data with the custom query and format it like the below
        //must be ordered by date, since dates cannot be sorted by recharts
        var dataParsed = [];
        if (!data3) {
          for (let i in response.data) {
            dataParsed.push({
              date: response.data[i][0],
              [queryName]: response.data[i][1],
            });
          }
        } else {
          for (let i in response.data) {
            dataParsed.push({
              ...data3[i],
              [queryName]: response.data[i][1],
            });
          }
        }
        setData3(dataParsed);
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
            Select Event Type:
            <select
              name="stormEvent"
              value={
                options.stormEvent.length === 0
                  ? "All Events (default)"
                  : `Selected ${options.stormEvent.length}`
              }
              onChange={handleChange}
            >
              <option>
                {options.stormEvent.length === 0
                  ? "All Events (default)"
                  : `Selected ${options.stormEvent.length}`}
              </option>
              <option value={"-----------"}>{"-----------"}</option>
              {eventTypes
                .filter((item, idx) => !options.stormEvent.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.stormEvent.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("stormEvent", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
          <label>
            Select State:
            <select
              name="stateCounty"
              value={
                options.stateCounty.length === 0
                  ? "All States (default)"
                  : `Selected ${options.stateCounty.length}`
              }
              onChange={handleChange}
            >
              <option>
                {options.stateCounty.length === 0
                  ? "All States (default)"
                  : `Selected ${options.stateCounty.length}`}
              </option>
              <option value={"-----------"}>{"-----------"}</option>
              {states
                .filter((item, idx) => !options.stateCounty.includes(item[0]))
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            {options.stateCounty.map((item, idx) => (
              <div key={idx} style={{ display: "inline-block" }}>
                <button
                  onClick={() => removeSelectedItem("stateCounty", item)}
                >{`${item} x`}</button>
              </div>
            ))}
          </div>
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
              disabled={data1}
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
              disabled={data1}
            />
          </label>
          <br />
          <label>
            Data Point Resolution:
            <select
              name="resolution"
              value={options.resolution}
              onChange={handleChange}
              disabled={data1}
            >
              {resolution.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          {data1 && (
            <b style={{ margin: "0", color: "DarkRed" }}>
              <br />
              Clear Graphs to reconfigure date and resolution settings
            </b>
          )}
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
          <br />
          <label>
            Gender
            <br />
            <select name="sex" value={options.sex} onChange={handleChange}>
              {sex.map((option) => (
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
        <button
          onClick={() => {
            clearCharts();
          }}
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
        {data1 && (
          <div style={{ alignContent: "center" }}>
            <h2>Storm Event Frequency Over Time</h2>
            <br />
            <div style={{ display: "inline-block" }}>
              <LineChart
                width={800}
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
                <Legend layout="vertical" verticalAlign="bottom" height={36} />
                {lines(data1)}
              </LineChart>
            </div>
          </div>
        )}
        {data2 && (
          <div style={{ alignContent: "center" }}>
            <h2>Storm Event Fatalities Over Time</h2>
            <br />
            <div style={{ display: "inline-block" }}>
              <LineChart
                width={800}
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
                <Legend layout="vertical" verticalAlign="bottom" height={36} />
                {lines(data2)}
              </LineChart>
            </div>
          </div>
        )}
        {data3 && (
          <div style={{ alignContent: "center" }}>
            <h2>Average Age of Fatalities Over Time</h2>
            <br />
            <div style={{ display: "inline-block" }}>
              <LineChart
                width={800}
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
                <Legend layout="vertical" verticalAlign="bottom" height={36} />
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

export default SevereWeatherTab;
