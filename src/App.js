import "./App.css";
import Homepage from "./Homepage";
import Navbar from "./Navbar";
import Former from "./Former";
import TrimPress from "./TrimPress";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage></Homepage>} />
          <Route path="/former" element={<Former></Former>} />
          <Route path="/trimpress" element={<TrimPress></TrimPress>} />
        </Routes>
      </div>
      <Navbar></Navbar>
    </BrowserRouter>
  );
}

export default App;
