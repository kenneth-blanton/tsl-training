import "./App.css";
// import Homepage from "./Homepage";
// import Former from "./Former";
// import TrimPress from "./TrimPress";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Guide from "./components/Guide/Guide";
import LandingPage from "./components/LandingPage";
import Tests from "./components/Testing/Tests";
import TakeTest from "./components/Testing/TakeTest";
import NotFoundPage from "./components/NotFoundPage";
import AdminDashboard from "./components/AdminPortal/AdminDashboard";
import SignUp from "./components/SignUp";
import EditTest from "./components/AdminPortal/EditTest";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/tsl-training/" element={<Guide />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/take-test/:id" element={<TakeTest />} />
          <Route path="/create" element={<AdminDashboard />} />
          <Route path="/edit-test/:id" element={<EditTest />} />
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
