import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import NotFound from "./pages/404";
import ElectionPage from "./pages/election";
import Hashing from "./pages/hashing";
import MerkleVerifier from "./pages/verify";
import Admin from "./pages/admin";
import Results from "./pages/results";

function App() {
  return (
    <>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/election" element={<ElectionPage />} />
            <Route path="/commitment" element={<Hashing />} />
            <Route path="/verification" element={<MerkleVerifier />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
