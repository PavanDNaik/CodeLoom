import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Problems from "./Problems";
import Contact from "../components/Contact";
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
          <Route exact path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
