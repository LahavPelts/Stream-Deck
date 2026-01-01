import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MatchInfo from './pages/scout/MatchInfo';
import AutoPage from './pages/scout/AutoPage';
import TeleopPage from './pages/scout/TeleopPage';
import EndgamePage from './pages/scout/EndgamePage';
import { MatchData, INITIAL_MATCH_DATA } from './types/schema';
import { setByPath } from './utils/calculations';

const Placeholder = ({ title }: { title: string }) => (
    <div style={{ padding: '2rem' }}><h1>{title}</h1><p>Under Construction</p></div>
);

const App: React.FC = () => {
  // Try to load current match from local storage to prevent data loss on refresh
  const savedState = localStorage.getItem('current_match_state');
  const [matchData, setMatchData] = useState<MatchData>(
      savedState ? JSON.parse(savedState) : { ...INITIAL_MATCH_DATA, timestamp: Date.now(), id: `match_${Date.now()}` }
  );

  // Auto-save to local storage whenever matchData changes
  useEffect(() => {
    localStorage.setItem('current_match_state', JSON.stringify(matchData));
  }, [matchData]);

  // Wrapper for updating state via path (lodash.set style)
  const updateNestedData = (path: string, value: any) => {
    setMatchData(prev => setByPath(prev, path, value));
  };

  // Deprecated wrapper for direct updates, kept for compatibility if needed
  const updateMatchData = (data: Partial<MatchData>) => {
      setMatchData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
      const newState = { ...INITIAL_MATCH_DATA, timestamp: Date.now(), id: `match_${Date.now()}` };
      setMatchData(newState);
      localStorage.setItem('current_match_state', JSON.stringify(newState));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Scouter Routes */}
            <Route path="/scouter" element={<Navigate to="/info" replace />} />
            <Route path="/info" element={<MatchInfo matchData={matchData} updateMatchData={updateMatchData} updateNestedData={updateNestedData} />} />
            <Route path="/auto" element={<AutoPage matchData={matchData} updateNestedData={updateNestedData} />} />
            <Route path="/teleop" element={<TeleopPage matchData={matchData} updateNestedData={updateNestedData} />} />
            <Route path="/endgame" element={<EndgamePage matchData={matchData} updateNestedData={updateNestedData} resetForm={resetForm} />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms" element={<Placeholder title="My Forms" />} />
            <Route path="/scans" element={<Placeholder title="Scans" />} />
            <Route path="/data" element={<Placeholder title="Data Manager" />} />
            <Route path="/games" element={<Placeholder title="Games" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;