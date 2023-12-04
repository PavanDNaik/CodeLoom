import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import Problems from "./Problems";
import Contact from "../components/Contact";
import PageNotFound from "./PageNotFound";
function Home() {
  let userName = JSON.parse(localStorage.getItem("user"));
  let token = JSON.parse(localStorage.getItem("authToken"));
  return (
    <div>
      <Navbar userName={userName} />
      <div>
        <Routes>
          <Route path="/" element={<Footer />} />
          <Route exact path="/problems" element={<Problems token={token} />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route Component={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
