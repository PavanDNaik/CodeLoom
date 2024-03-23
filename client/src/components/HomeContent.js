import React from "react";
import Footer from "../components/Footer";
function HomeContent() {
  return (
    <div className="Home-content-container">
      <div>
        <div className="white">
          <header className="home-hero-container">
            <h1 className="hero-text">Welcome to CodeLoom</h1>
            <div class="second-hero ">
              <div class="eng">Your Gateway to Coding Mastery</div>
            </div>
            <div className="hero-floating-content">
              <h2>Unlock Your Coding Potential</h2>
              <p>
                CodeLoom is the ultimate platform for practicing coding and
                mastering programming skills.
              </p>
            </div>
          </header>
        </div>
        <div className="black">
          <section className="home-exp-container">
            <h2>Get Started Today!</h2>
            <p>
              Begin your coding adventure with CodeLoom. Practice, learn, and
              thrive!
            </p>
            <h2>Why CodeLoom?</h2>
            <p>
              Transform your coding journey with our interactive learning
              platform, making coding fun and easy.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomeContent;
