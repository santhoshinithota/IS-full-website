import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StorySelection from './pages/StorySelection';
import Narration from './pages/Narration';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<StorySelection />} />
          <Route path="/narration/:id" element={<Narration />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
