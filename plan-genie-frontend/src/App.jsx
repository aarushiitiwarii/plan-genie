import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from './components/NavBar';
import Home from './pages/home.jsx';
import InputPage from './pages/input.jsx';
import Manage from "./pages/manage.jsx";
import Roadmap from './pages/Roadmap.jsx';
import Profile from './pages/profile.jsx';
import History from './pages/history.jsx';
import Help from './pages/help.jsx';
import Result from './pages/Result.jsx';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleMeetScroll = () => {
    const section = document.getElementById("meet-plangenie");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar onMeetClick={handleMeetScroll} showLoginModal={() => setShowLogin(true)} />
              <Home showLogin={showLogin} setShowLogin={setShowLogin} />
            </>
          }
        />
        <Route path="/input" element={<InputPage />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/help" element={<Help />} />
        <Route path="/result" element={<Result />} />
        <Route
          path="/roadmap"
          element={
            <Roadmap
              startDate={new Date()}
              weeks={4}
              tasks={[
                ["Task 1: Watch a React tutorial"],
                ["Task 2: Build a simple app"],
                ["Task 3: Deploy your app"]
              ]}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
