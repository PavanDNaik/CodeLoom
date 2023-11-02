import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signupform from "./components/Signupform";
import Loginform from "./components/Loginform";
import Problems from "./screens/Problems";
import Editor from "./components/Editor";
import "./App.css";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/sign-up" element={<Signupform />} />
          <Route exact path="/login" element={<Loginform />} />
          <Route exact path="/problems" element={<Problems />} />
          <Route exact path="/problems/:problemId" element={<Editor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
