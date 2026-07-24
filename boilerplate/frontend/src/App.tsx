import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DAppLayout } from './pages/DAppLayout';
import { DApp } from './pages/DApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DAppLayout />}>
          <Route path="/app" element={<DApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
