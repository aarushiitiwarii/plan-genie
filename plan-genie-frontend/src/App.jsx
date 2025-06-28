import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home.jsx';
import InputPage from './pages/input.jsx'; 
import Manage from "./pages/manage.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/manage" element={<Manage />} />
      </Routes>
    </Router>
  );
}

export default App;