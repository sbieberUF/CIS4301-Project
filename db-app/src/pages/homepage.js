import React from "react";
import "./App.css";
// Importing Link from react-router-dom to 
// navigate to different end points.
import { Link } from "react-router-dom";
 
const Home = () => {
    return (
        <div>
            <header className="App-header"> 
            <h1>Environmental Resilience Tracker</h1>
            <ul>
                <li className="ul_top_hypers">
                    {/* Endpoint to route to Home component */}
                    <Link to="/">Home</Link>
                </li>
                <li className="ul_top_hypers">
                    {/* Endpoint to route to Storm component */}
                    <Link to="/storm">Storm</Link>
                </li>
                <li className="ul_top_hypers">
                    {/* Endpoint to route to TempDeath component */}
                    <Link to="/tempdeath">Temperature-Dependent Mortality</Link>
                </li>
                <li className="ul_top_hypers">
                    {/* Endpoint to route to InsectAg component */}
                    <Link to="/insectag">Invasive Insects</Link>
                </li>
                <li className="ul_top_hypers">
                    {/* Endpoint to route to Precip component */}
                    <Link to="/precip">Extreme Precipitation</Link>
                </li>
                <li className="ul_top_hypers">
                    {/* Endpoint to route to GlobSpend component */}
                    <Link to="/globspend">Global Spending</Link>
                </li>
            </ul>
            </header>
            <br />
        </div>
    );
};
 
export default Home;
