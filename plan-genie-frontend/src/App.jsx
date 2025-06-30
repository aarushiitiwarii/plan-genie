import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home.jsx';
import InputPage from './pages/input.jsx'; 
import Manage from "./pages/manage.jsx";
import Roadmap from './pages/Roadmap.jsx'; // <-- Import your Roadmap component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/manage" element={<Manage />} />
        <Route
          path="/roadmap"
          element={
            <Roadmap
              startDate={new Date()}
              weeks={4} // Replace with dynamic value as needed
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