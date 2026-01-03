import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, 
  TableBody, Chip, IconButton, Button, Tooltip, Switch, FormControlLabel, Toolbar, AppBar,
  TextField, InputAdornment, Grid, Card, CardContent, Divider, Stack
} from '@mui/material';
import { getMatches, importMatches } from '../services/storage';
import { MatchData } from '../types/schema';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// Recharts
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, CartesianGrid, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line
} from 'recharts';

// --- Constants ---
const POINTS = {
  AUTO: { L4: 6, L3: 5, L2: 4, L1: 3, PROC: 6, NET: 4, LINE: 3 },
  TELE: { L4: 4, L3: 3, L2: 2, L1: 1, PROC: 6, NET: 4 }
};

// --- Types ---
interface TeamStats {
  teamNumber: string;
  matchesPlayed: number;
  avgTotalPoints: number;
  avgAutoPoints: number;
  avgTeleopPoints: number;
  // Coral
  avgCoralTotal: number;
  avgL4: number;
  avgL3: number;
  avgL2: number;
  avgL1: number;
  // Algae
  avgAlgaeTotal: number;
  avgProcessor: number;
  avgNet: number;
  // Defense / Misc
  defenseRating: number;
  maxAutoCoral: number; // Peak Auto Performance
  capabilities: string[]; // List of things they can do (e.g., "L4", "Processor")
}

type SortKey = keyof TeamStats;
type ViewMode = 'leaderboard' | 'compare' | 'detail';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [view, setView] = useState<ViewMode>('leaderboard');
  
  // Filters & UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [excludeDefense, setExcludeDefense] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'avgTotalPoints', direction: 'desc' });
  const [expandedGroups, setExpandedGroups] = useState<{ coral: boolean; algae: boolean }>({ coral: false, algae: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMatches(getMatches());
  }, []);

  // --- Data Aggregation ---
  const teamStats = useMemo(() => {
    const teamMap: Record<string, MatchData[]> = {};
    
    // Group matches by team
    matches.forEach(m => {
      // Defense Filter: If enabled, skip matches where they played defense
      if (excludeDefense && m.teleop.playedDefense) return;
      
      const t = m.match.teamNumber;
      if (!t) return;
      if (!teamMap[t]) teamMap[t] = [];
      teamMap[t].push(m);
    });

    const stats: TeamStats[] = Object.keys(teamMap).map(team => {
      const teamMatches = teamMap[team];
      const count = teamMatches.length;

      let maxAuto = 0;

      const sums = teamMatches.reduce((acc, m) => {
        // Auto Calc
        const autoCoralCount = m.auto.coral.l4 + m.auto.coral.l3 + m.auto.coral.l2 + m.auto.coral.l1;
        if (autoCoralCount > maxAuto) maxAuto = autoCoralCount;

        const autoPts = 
          (m.auto.coral.l4 * POINTS.AUTO.L4) + (m.auto.coral.l3 * POINTS.AUTO.L3) + 
          (m.auto.coral.l2 * POINTS.AUTO.L2) + (m.auto.coral.l1 * POINTS.AUTO.L1) +
          (m.auto.algae.processor * POINTS.AUTO.PROC) + (m.auto.algae.net * POINTS.AUTO.NET) +
          (m.auto.crossedLine ? POINTS.AUTO.LINE : 0);
        
        const telePts = 
          (m.teleop.coral.l4 * POINTS.TELE.L4) + (m.teleop.coral.l3 * POINTS.TELE.L3) +
          (m.teleop.coral.l2 * POINTS.TELE.L2) + (m.teleop.coral.l1 * POINTS.TELE.L1) +
          (m.teleop.algae.processor * POINTS.TELE.PROC) + (m.teleop.algae.net * POINTS.TELE.NET);

        return {
          total: acc.total + autoPts + telePts,
          auto: acc.auto + autoPts,
          tele: acc.tele + telePts,
          l4: acc.l4 + m.auto.coral.l4 + m.teleop.coral.l4,
          l3: acc.l3 + m.auto.coral.l3 + m.teleop.coral.l3,
          l2: acc.l2 + m.auto.coral.l2 + m.teleop.coral.l2,
          l1: acc.l1 + m.auto.coral.l1 + m.teleop.coral.l1,
          proc: acc.proc + m.auto.algae.processor + m.teleop.algae.processor,
          net: acc.net + m.auto.algae.net + m.teleop.algae.net,
          def: acc.def + (m.teleop.playedDefense ? 1 : 0),
        };
      }, { total: 0, auto: 0, tele: 0, l4: 0, l3: 0, l2: 0, l1: 0, proc: 0, net: 0, def: 0 });

      const safeDiv = (n: number) => parseFloat((n / count).toFixed(1));
      
      const avgL4 = safeDiv(sums.l4);
      const avgL3 = safeDiv(sums.l3);
      const avgL2 = safeDiv(sums.l2);
      const avgL1 = safeDiv(sums.l1);
      const avgProc = safeDiv(sums.proc);
      const avgNet = safeDiv(sums.net);

      // Determine Capabilities (Badges)
      const capabilities: string[] = [];
      if (avgL4 > 0.1) capabilities.push('L4');
      if (avgL3 > 0.1) capabilities.push('L3');
      if (avgProc > 0.1) capabilities.push('Processor');
      if (avgNet > 0.1) capabilities.push('Net');
      if (maxAuto > 0) capabilities.push(`Auto Peak: ${maxAuto}`);

      return {
        teamNumber: team,
        matchesPlayed: count,
        avgTotalPoints: safeDiv(sums.total),
        avgAutoPoints: safeDiv(sums.auto),
        avgTeleopPoints: safeDiv(sums.tele),
        avgL4, avgL3, avgL2, avgL1,
        avgCoralTotal: safeDiv(sums.l4 + sums.l3 + sums.l2 + sums.l1),
        avgProcessor: avgProc,
        avgNet: avgNet,
        avgAlgaeTotal: safeDiv(sums.proc + sums.net),
        defenseRating: safeDiv(sums.def),
        maxAutoCoral: maxAuto,
        capabilities
      };
    });

    // Filter by Search
    const filtered = stats.filter(s => s.teamNumber.includes(searchTerm));

    // Sort
    return filtered.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (typeof valA === 'string' && typeof valB === 'string') return 0; 
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  }, [matches, excludeDefense, searchTerm, sortConfig]);

  // --- Handlers ---
  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleGroup = (group: 'coral' | 'algae') => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSelectTeam = (team: string) => {
    setSelectedTeams(prev => 
      prev.includes(team) 
        ? prev.filter(t => t !== team) 
        : (prev.length < 6 ? [...prev, team] : prev) // Limit to 6 for comparison
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target?.result as string);
            importMatches(data);
            setMatches(getMatches()); // Refresh
        } catch (err) {
            alert("Invalid File");
        }
      };
      reader.readAsText(file);
  };

  // --- Render Sections ---

  const renderLeaderboard = () => (
    <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', borderRadius: 0 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {/* Sticky Rank */}
              <TableCell 
                sx={{ 
                  position: 'sticky', left: 0, zIndex: 3, 
                  bgcolor: 'background.paper', width: 60,
                  borderRight: '1px solid rgba(224, 224, 224, 1)'
                }}
              >
                Rank
              </TableCell>
              {/* Sticky Team */}
              <TableCell 
                sx={{ 
                  position: 'sticky', left: 60, zIndex: 3, 
                  bgcolor: 'background.paper', width: 80, fontWeight: 'bold',
                  borderRight: '2px solid rgba(224, 224, 224, 1)',
                  boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                  cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleSort('teamNumber')}
              >
                Team {sortConfig.key === 'teamNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>

              {/* Dynamic Headers */}
              {[
                  { id: 'avgTotalPoints', label: 'Total', w: 80 },
                  { id: 'avgAutoPoints', label: 'Auto', w: 80 },
                  { id: 'avgTeleopPoints', label: 'Tele', w: 80 },
              ].map((h) => (
                  <TableCell 
                    key={h.id}
                    align="center"
                    sx={{ fontWeight: 'bold', cursor: 'pointer', minWidth: h.w, bgcolor: sortConfig.key === h.id ? 'action.selected' : 'inherit' }}
                    onClick={() => handleSort(h.id as SortKey)}
                  >
                     {h.label} {sortConfig.key === h.id && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableCell>
              ))}

              {/* Expandable Coral */}
              {expandedGroups.coral ? (
                <>
                   <TableCell align="center" sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => toggleGroup('coral')}>Coral (-)</TableCell>
                   {['L4', 'L3', 'L2', 'L1'].map(l => (
                       <TableCell 
                           key={l} align="center" 
                           onClick={() => handleSort(`avg${l}` as SortKey)}
                           sx={{ cursor: 'pointer', bgcolor: sortConfig.key === `avg${l}` ? 'action.selected' : 'inherit' }}
                       >
                           {l}
                       </TableCell>
                   ))}
                </>
              ) : (
                <TableCell align="center" sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => toggleGroup('coral')}>
                    Coral (+)
                </TableCell>
              )}

              {/* Expandable Algae */}
              {expandedGroups.algae ? (
                <>
                  <TableCell align="center" sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => toggleGroup('algae')}>Algae (-)</TableCell>
                  <TableCell align="center" onClick={() => handleSort('avgProcessor')}>Proc</TableCell>
                  <TableCell align="center" onClick={() => handleSort('avgNet')}>Net</TableCell>
                </>
              ) : (
                 <TableCell align="center" sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => toggleGroup('algae')}>
                     Algae (+)
                 </TableCell>
              )}
              
              <TableCell align="center" onClick={() => handleSort('defenseRating')}>Def %</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teamStats.map((team, index) => {
              const selected = selectedTeams.includes(team.teamNumber);
              return (
                <TableRow 
                  key={team.teamNumber}
                  hover
                  onClick={() => toggleSelectTeam(team.teamNumber)}
                  selected={selected}
                  sx={{ 
                    cursor: 'pointer',
                    '&:nth-of-type(odd)': { bgcolor: selected ? 'primary.light' : 'rgba(0, 0, 0, 0.04)' },
                    '&:nth-of-type(even)': { bgcolor: selected ? 'primary.light' : 'white' },
                    '&.Mui-selected': { bgcolor: 'rgba(0, 105, 148, 0.2) !important' }
                  }}
                >
                  <TableCell sx={{ position: 'sticky', left: 0, zIndex: 2, bgcolor: 'inherit', borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ position: 'sticky', left: 60, zIndex: 2, bgcolor: 'inherit', borderRight: '2px solid #e0e0e0', boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)', color: 'primary.main', fontWeight: 'bold' }}>
                    {team.teamNumber}
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{team.avgTotalPoints}</TableCell>
                  <TableCell align="center">{team.avgAutoPoints}</TableCell>
                  <TableCell align="center">{team.avgTeleopPoints}</TableCell>

                  {/* Coral */}
                  {expandedGroups.coral ? (
                    <>
                      <TableCell align="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}><UnfoldLessIcon fontSize="small" color="disabled" /></TableCell>
                      <TableCell align="center" sx={{ color: team.avgL4 > 1.5 ? 'success.main' : 'inherit', fontWeight: team.avgL4 > 1.5 ? 'bold' : 'normal' }}>{team.avgL4}</TableCell>
                      <TableCell align="center">{team.avgL3}</TableCell>
                      <TableCell align="center">{team.avgL2}</TableCell>
                      <TableCell align="center">{team.avgL1}</TableCell>
                    </>
                  ) : (
                    <TableCell align="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        {team.avgCoralTotal}
                    </TableCell>
                  )}

                   {/* Algae */}
                   {expandedGroups.algae ? (
                    <>
                      <TableCell align="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}><UnfoldLessIcon fontSize="small" color="disabled" /></TableCell>
                      <TableCell align="center">{team.avgProcessor}</TableCell>
                      <TableCell align="center">{team.avgNet}</TableCell>
                    </>
                  ) : (
                    <TableCell align="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>{team.avgAlgaeTotal}</TableCell>
                  )}

                  <TableCell align="center">{Math.round(team.defenseRating * 100)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
    </TableContainer>
  );

  const renderComparison = () => {
      const teams = teamStats.filter(t => selectedTeams.includes(t.teamNumber));
      
      return (
          <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
              <Grid container spacing={3}>
                  <Grid item xs={12}>
                       <Card variant="outlined">
                           <CardContent>
                               <Typography variant="h6" gutterBottom>Points Comparison</Typography>
                               <Box sx={{ height: 350 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                       <BarChart data={teams}>
                                           <CartesianGrid strokeDasharray="3 3" />
                                           <XAxis dataKey="teamNumber" />
                                           <YAxis />
                                           <RechartsTooltip />
                                           <Legend />
                                           <Bar dataKey="avgAutoPoints" name="Auto" fill="#1e3a8a" stackId="a" />
                                           <Bar dataKey="avgTeleopPoints" name="Teleop" fill="#42a5f5" stackId="a" />
                                       </BarChart>
                                   </ResponsiveContainer>
                               </Box>
                           </CardContent>
                       </Card>
                  </Grid>
                  {/* Detailed Comparison Table could go here */}
              </Grid>
          </Box>
      )
  }

  const renderDetail = () => {
      const teamNum = selectedTeams[0];
      const stats = teamStats.find(s => s.teamNumber === teamNum);
      const teamMatches = matches.filter(m => m.match.teamNumber === teamNum && (!excludeDefense || !m.teleop.playedDefense));
      
      if (!stats) return <Typography>Team not found</Typography>;

      // Radar Data
      const radarData = [
          { subject: 'Auto', A: (stats.avgAutoPoints / 30) * 100, fullMark: 100 },
          { subject: 'Teleop', A: (stats.avgTeleopPoints / 60) * 100, fullMark: 100 },
          { subject: 'L4', A: (stats.avgL4 / 5) * 100, fullMark: 100 },
          { subject: 'Proc', A: (stats.avgProcessor / 3) * 100, fullMark: 100 },
          { subject: 'Defense', A: stats.defenseRating * 100, fullMark: 100 },
      ];

      // Trend Data
      const trendData = teamMatches.map((m, i) => ({
          match: `Q${m.match.number}`,
          total: (m.auto.coral.l4 * 6) + (m.teleop.coral.l4 * 4) + (m.auto.coral.l1 * 3) // Simplified calc for chart demo
      }));

      return (
          <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
              <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                  Team {teamNum}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {stats.capabilities.map(cap => (
                      <Chip 
                        key={cap} 
                        label={cap} 
                        color={cap.includes('Peak') ? 'secondary' : 'primary'} 
                        variant={cap.includes('Peak') ? 'filled' : 'outlined'} 
                      />
                  ))}
              </Box>

              <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                       <Card variant="outlined" sx={{ height: '100%' }}>
                           <CardContent sx={{ height: 350 }}>
                               <Typography variant="h6">Performance Profile</Typography>
                               <ResponsiveContainer width="100%" height="100%">
                                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                       <PolarGrid />
                                       <PolarAngleAxis dataKey="subject" />
                                       <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                       <Radar name={teamNum} dataKey="A" stroke="#006994" fill="#006994" fillOpacity={0.6} />
                                       <RechartsTooltip />
                                   </RadarChart>
                               </ResponsiveContainer>
                           </CardContent>
                       </Card>
                   </Grid>
                   <Grid item xs={12} md={6}>
                       <Card variant="outlined" sx={{ height: '100%' }}>
                           <CardContent sx={{ height: 350 }}>
                               <Typography variant="h6">Consistency (Trend)</Typography>
                               <ResponsiveContainer width="100%" height="100%">
                                   <LineChart data={trendData}>
                                       <CartesianGrid strokeDasharray="3 3" />
                                       <XAxis dataKey="match" />
                                       <YAxis />
                                       <RechartsTooltip />
                                       <Line type="monotone" dataKey="total" stroke="#ff9100" strokeWidth={3} />
                                   </LineChart>
                               </ResponsiveContainer>
                           </CardContent>
                       </Card>
                   </Grid>
              </Grid>
          </Box>
      );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      
      {/* Top Bar */}
      <AppBar position="static" color="inherit" elevation={1}>
         <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, minHeight: 'auto', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {view !== 'leaderboard' && (
                    <IconButton onClick={() => setView('leaderboard')}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <Typography variant="h6" color="primary" fontWeight="bold">
                    {view === 'leaderboard' ? 'Dashboard' : view === 'compare' ? 'Comparison' : 'Team Detail'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField 
                    size="small" 
                    placeholder="Search Team..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                    }}
                    sx={{ width: 150 }}
                />
                <FormControlLabel
                    control={<Switch size="small" checked={excludeDefense} onChange={(e) => setExcludeDefense(e.target.checked)} />}
                    label={<Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FilterAltIcon fontSize="small"/> No Def</Typography>}
                />
                <IconButton color="primary" component="label">
                   <UploadIcon />
                   <input type="file" hidden accept=".json" onChange={handleFileUpload} />
                </IconButton>
            </Box>
         </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view === 'leaderboard' && renderLeaderboard()}
          {view === 'compare' && renderComparison()}
          {view === 'detail' && renderDetail()}
      </Box>

      {/* Floating Action Bar */}
      {view === 'leaderboard' && selectedTeams.length > 0 && (
        <Paper 
          elevation={10} 
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 1000,
            borderRadius: 50,
            bgcolor: '#1a1a1a',
            color: 'white',
            px: 3, py: 1.5,
            display: 'flex', alignItems: 'center', gap: 2,
            maxWidth: '90vw'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{selectedTeams.length} Teams</Typography>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'gray' }} />
          
          {selectedTeams.length === 1 ? (
             <Button 
                variant="contained" 
                color="secondary" 
                size="small" 
                startIcon={<VisibilityIcon />}
                onClick={() => setView('detail')}
             >
               View
             </Button>
          ) : (
            <Button 
                variant="contained" 
                color="secondary" 
                size="small" 
                startIcon={<CompareArrowsIcon />}
                onClick={() => setView('compare')}
             >
               Compare
             </Button>
          )}
          <Button 
            sx={{ color: '#aaa' }}
            size="small"
            onClick={() => setSelectedTeams([])}
          >
            Clear
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;