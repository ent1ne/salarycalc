import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SalaryCalculator } from './components/SalaryCalculator';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SalaryCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
