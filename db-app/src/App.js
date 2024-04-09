import logo from "./logo.svg";
import "./pages/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/homepage";
import Storm from "./pages/stormpage.js";
import TempDeath from "./pages/temppage.js";
import InsectAg from "./pages/invasivepage.js";
import Precip from "./pages/precippage.js";
import GlobSpend from "./pages/globspendpage.js";

function App() {
  return (
    <>
    {/* This is the alias of BrowserRouter i.e. Router */}
    <Router>
        <Routes>
            {/* This route is for home component 
  with exact path "/", in component props 
  we passes the imported component*/}
            <Route
                exact
                path="/"
                element={<Home />}
            />
            <Route
                path="/storm"
                element={<Storm />}
            />
            <Route
                path="/tempdeath"
                element={<TempDeath />}
            />
            <Route
                path="/insectag"
                element={<InsectAg />}
            />
            <Route
                path="/precip"
                element={<Precip />}
            />
            <Route
                path="/globspend"
                element={<GlobSpend />}
            />
        </Routes>
    </Router>
</>
);
    /* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  ); */
}

export default App;
//Run 'npm start' to run it
