import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Problems from "./Problems";
import Contact from "../components/Contact";
import PageNotFound from "./PageNotFound";
function Home() {
  const location = useLocation();
  let info = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Navbar {...info} />
      <div>
        <Routes>
          <Route exact path="/problems" element={<Problems user={info} />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route Component={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
