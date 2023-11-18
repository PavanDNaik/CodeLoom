import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signupform from "./components/Signupform";
import Loginform from "./components/Loginform";
import DashBoard from "./screens/DashBoard";
import PageNotFound from "./screens/PageNotFound";
import "./App.css";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<DashBoard />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/sign-up" element={<Signupform />} />
          <Route exact path="/login" element={<Loginform />} />
          <Route exact path="/404" element={<PageNotFound />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
