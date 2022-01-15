import { Routes, Route } from 'react-router-dom';
import './App.css';
import '@dracula/dracula-ui/styles/dracula-ui.css'

import Home from './pages/Home';
import Where from './pages/Where';
import Erramos from './pages/Erramos';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/where" element={<Where />} />
      <Route path="/erramos" element={<Erramos />} />
    </Routes>
    </>
  );
}

export default App;
