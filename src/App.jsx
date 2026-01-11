import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import BioSwitcher from './components/BioSwitcher';
import BioContent from './components/BioContent';
import DarkModeToggle from './components/DarkModeToggle';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('short');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    // Default to dark mode if not set, or if set to 'on'
    return saved === 'off' ? false : true;
  });

  useEffect(() => {
    // Persist preference
    localStorage.setItem('darkMode', darkMode ? 'on' : 'off');

    // Apply class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const colors = ["#24d05a", "#e4094b", "#10a2f5", "#e9bc3f"];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    const setRandomLinkColor = () => {
      const links = document.querySelectorAll("a");
      links.forEach(e => {
        e.style.textDecorationColor = getRandomColor();
      });
    };

    setRandomLinkColor();
    const linkInterval = setInterval(setRandomLinkColor, 5000);

    const handleMouseOver = (event) => {
      if (event.target.matches("a, button")) {
        setRandomLinkColor();
      }
    };
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      clearInterval(linkInterval);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        <Nav />
        <BioSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        <BioContent activeTab={activeTab} darkMode={darkMode} />
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <Footer />
    </>
  );
}

export default App;
