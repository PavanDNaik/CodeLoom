import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signupform from "./components/Signupform";
import Loginform from "./components/Loginform";
import AdminLogIn from "./components/AdminLogIn";
import Landing from "./screens/Landing";
import PageNotFound from "./screens/PageNotFound";
import Code from "./screens/Code";
import "./App.css";
import AdminDashBoard from "./screens/AdminDashBoard";
import { RecoilRoot } from "recoil";
function App() {
  return (
    <div>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/home/*" element={<Home />} />
            <Route exact path="/problems/:problemId" element={<Code />} />
            <Route exact path="/sign-up" element={<Signupform />} />
            <Route exact path="/login" element={<Loginform />} />
            <Route
              exact
              path="/admin/:admin/dashboard/*"
              element={<AdminDashBoard />}
            ></Route>
            <Route
              exact
              path="/admin/:admin/:email/log-in/*"
              element={<AdminLogIn />}
            ></Route>
            <Route exact path="*" element={<PageNotFound />}></Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;
