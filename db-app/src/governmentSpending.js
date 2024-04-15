import React, { useEffect, useState } from "react";
import "./index.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Tables:
 * 1. population_datum
 * 2. country_data
 * 3. policy_expenditure_datum
 * 4. co2_emission
 */

// response: [[country_name, year, capital_in_local_currency, population, percent_gdp], ...] to array of objects
function responseParser(response) {
  return response.map((row) => {
    return {
      country_name: row[0],
      year: row[1],
      capital_in_local_currency: row[2],
      population: row[3],
      percent_gdp: row[4],
    };
  });
}

const YEARS = [];

for (let i = 1995; i <= 2024; i++) YEARS.push(i);

function getYearFilter(startYear, endYear) {
  if (startYear && endYear) {
    return ` p.year > ${startYear} and p.year < ${endYear} and`;
  } else if (startYear) {
    return ` p.year > ${startYear} and`;
  } else if (endYear) {
    return ` p.year < ${endYear} and`;
  } else return "";
}

function getCountryFilter(country) {
  return ` c.country_name = '${country}' and`;
}

function getPolicyFilter(policies) {
  if (policies.length === 0 || policies.includes("All Policies")) return "";
  return ` p.policy_category IN (${policies.map(
    (policy) => `'${policy}'`
  )}) and`;
}

export default function GovermentSpending() {
  const [yearStart, setYearStart] = useState(2000);
  const [yearEnd, setYearEnd] = useState(2024);

  const [country, setCountry] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [queryResponse, setQueryResponse] = useState([]);

  const _query =
    `SELECT c.country_name, p.year, p.capital_in_local_currency, pd.population, p.percent_gdp * 100 FROM country_data c JOIN policy_expenditure_datum p ON c.country_id = p.country_id JOIN population_datum pd ON pd.country_id = p.country_id AND pd.year = p.year WHERE ${getYearFilter(
      yearStart,
      yearEnd
    )} ${getCountryFilter(country)} ${getPolicyFilter(
      policies
    )} p.capital_in_local_currency > 0`.trim();

  const data = [
    { name: "Jan", value: 10 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 25 },
    { name: "May", value: 30 },
    { name: "Jun", value: 35 },
  ];

  function getGraphData() {
    return queryResponse.map((row) => {
      return {
        name: row.year,
        value: row.capital_in_local_currency,
      };
    });
  }

  const [allCountries, setAllCountries] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);

  async function fetchData(_query) {
    const data = await fetch(
      `http://localhost:5001?query=${encodeURIComponent(_query)}`
    ).then((res) => res.json());

    return data;
  }

  useEffect(() => {
    async function fetchAll() {
      const fetchAllCountriesQuery = "select country_name from country_data";
      const d = await fetchData(fetchAllCountriesQuery);

      setAllCountries(d.map((row) => row[0]));

      setCountry(d[0][0]);

      const fetchAllPoliciesQuery =
        "select distinct(policy_category) from policy_expenditure_datum";
      const p = await fetchData(fetchAllPoliciesQuery);

      setAllPolicies([...p, ["All Policies"]].map((row) => row[0]));
    }

    fetchAll();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    console.log(_query);
    const dd = await fetchData(_query);

    const parsedOut = responseParser(dd);

    setQueryResponse(parsedOut);
  }

  return (
    <div>
      <h3 style={{ marginTop: 20 }}>
        Goverment Spendings on controlling CO<sub>2</sub> Emissions by
        Implementing Policies
      </h3>
      <div className="govt-spending-box">
        <div style={{ paddingInline: "2rem" }}>
          <form className="govt-spending-form" onSubmit={onSubmit}>
            <label>
              <div>Start Year</div>
            </label>
            <select
              value={yearStart}
              onChange={(e) => setYearStart(e.target.value)}
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <label>
              <div>End Year</div>
            </label>
            <select
              value={yearEnd}
              onChange={(e) => setYearEnd(e.target.value)}
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <label>
              <div>Country</div>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {allCountries &&
                allCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
            </select>

            <label>
              <div>Policies</div>
            </label>
            <select
              style={{ padding: 10, height: 150 }}
              multiple
              value={policies}
              onChange={(e) => {
                setPolicies((d) => {
                  if (d.includes(e.target.value)) {
                    return d.filter((policy) => policy !== e.target.value);
                  } else return d.concat(e.target.value);
                });
              }}
            >
              {allPolicies &&
                allPolicies.map((policy) => (
                  <option key={policy} value={policy}>
                    {policy}
                  </option>
                ))}
            </select>
            <button style={{ marginTop: 10 }} type="submit">
              Fetch Data
            </button>
          </form>
        </div>
        <div style={{ paddingInline: "2rem" }}>
          <LineChart width={800} height={500} data={getGraphData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
