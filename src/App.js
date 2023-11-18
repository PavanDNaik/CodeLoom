import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signupform from "./components/Signupform";
import Loginform from "./components/Loginform";
import Problems from "./screens/Problems";
import Code from "./screens/Code";
import DashBoard from "./screens/DashBoard";
import "./App.css";
import PageNotFound from "./screens/PageNotFound";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<DashBoard />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/sign-up" element={<Signupform />} />
          <Route exact path="/login" element={<Loginform />} />
          <Route exact path="/problems" element={<Problems />} />
          <Route exact path="/problems/:problemId" element={<Code />} />
          <Route exact path="/404" element={<PageNotFound />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
