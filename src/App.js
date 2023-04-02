import "./App.css";
// import Homepage from "./Homepage";
// import Former from "./Former";
// import TrimPress from "./TrimPress";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Introduction from "./components/Introduction";
import LandingPage from "./components/LandingPage";
import Tests from "./components/Tests";
import TakeTest from "./components/TakeTest";
import NotFoundPage from "./components/NotFoundPage";
import CreateTest from "./components/CreateTest";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tsl-training/" element={<Introduction />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/create" element={<CreateTest />} />
          <Route path="/take-test/:id" element={<TakeTest />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* <Route path="/home" element={<Homepage />} />
          <Route path="/former" element={<Former />} />
          <Route path="/trimpress" element={<TrimPress />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
