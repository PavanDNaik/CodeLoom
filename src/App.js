import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signupform from "./components/Signupform";
import Loginform from "./components/Loginform";
import Landing from "./screens/Landing";
import PageNotFound from "./screens/PageNotFound";
import Code from "./screens/Code";
import "./App.css";
import AdminDashBoard from "./screens/AdminDashBoard";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/home/*" element={<Home />} />
          <Route exact path="/problems/:problemId" element={<Code />} />
          <Route exact path="/sign-up" element={<Signupform />} />
          <Route exact path="/login" element={<Loginform />} />
          <Route
            exact
            path="/:admin/dashboard/*"
            element={<AdminDashBoard />}
          ></Route>
          <Route exact path="/404" element={<PageNotFound />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
