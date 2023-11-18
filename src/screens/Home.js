import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Code from "./Code";
import Problems from "./Problems";
function Home() {
  const location = useLocation();
  let info = localStorage.getItem("user");
  if (location.state) {
    info = location.state;
  } else if (info) {
    info = JSON.parse(info);
  }
  return (
    <div>
      <Navbar {...info} />
      <div>
        <Routes>
          <Route exact path="/problems" element={<Problems />} />
          <Route exact path="/problems/:problemId" element={<Code />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
