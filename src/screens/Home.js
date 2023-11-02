import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

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
      <div>Some info about the website </div>
      <Footer />
    </div>
  );
}

export default Home;
