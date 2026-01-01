import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Switch, FormControlLabel } from '@mui/material';
import { getMatches } from '../services/storage';
import { MatchData } from '../types/schema';
import { calculateTotalPoints } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [hybridMode, setHybridMode] = useState(false); // API Toggle placeholder

  useEffect(() => {
    setMatches(getMatches());
  }, []);

  const processedData = matches.map(m => ({
    team: m.match.teamNumber,
    match: m.match.number,
    total: calculateTotalPoints(m),
    auto: (m.auto.coral.l4 * 6) + (m.auto.coral.l3 * 5), // Simplified math
    teleop: (m.teleop.coral.l4 * 4) + (m.teleop.coral.l3 * 3),
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">Dashboard</Typography>
        <FormControlLabel
            control={<Switch checked={hybridMode} onChange={(e) => setHybridMode(e.target.checked)} />}
            label="Hybrid Mode (API)"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 3, height: '20rem' }}>
            <Typography variant="h6" gutterBottom>Performance Mapping</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="auto" fill="#8884d8" name="Auto Pts" />
                <Bar dataKey="teleop" fill="#82ca9d" name="Teleop Pts" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Stats Section */}
        <Grid xs={12} md={4}>
            <Paper sx={{ p: 3, height: '20rem' }}>
                <Typography variant="h6">Quick Stats</Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Matches Scouted: {matches.length}</Typography>
                    <Typography variant="body1">Avg Score: {processedData.length > 0 ? (processedData.reduce((a,b)=>a+b.total,0)/processedData.length).toFixed(1) : 0}</Typography>
                </Box>
            </Paper>
        </Grid>

        {/* Leaderboard Table */}
        <Grid xs={12}>
          <TableContainer component={Paper} sx={{ maxHeight: '30rem' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Team</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Match</TableCell>
                  <TableCell>Auto</TableCell>
                  <TableCell>Teleop</TableCell>
                  <TableCell>Endgame</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>#{index + 1}</TableCell>
                    <TableCell>
                        <Chip label={row.match.teamNumber} size="small" color={row.match.alliance === 'R' ? 'error' : 'primary'} />
                    </TableCell>
                    <TableCell>{row.match.number}</TableCell>
                    <TableCell>{(row.auto.coral.l4 * 6) + (row.auto.coral.l3 * 5)}</TableCell>
                    <TableCell>{(row.teleop.coral.l4 * 4) + (row.teleop.coral.l3 * 3)}</TableCell>
                    <TableCell>{row.endgame.endState > 0 ? 'Yes' : 'No'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{calculateTotalPoints(row)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;