import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, Dialog, DialogContent, IconButton } from '@mui/material';
import { getScans, saveScan } from '../services/storage';
import { MatchData } from '../types/schema';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const Scans: React.FC = () => {
  const [scans, setScans] = useState<MatchData[]>([]);
  const [search, setSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    setScans(getScans());
  }, []);

  useEffect(() => {
    if (isScanning) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
          const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
          );
          
          scanner.render(onScanSuccess, onScanFailure);
          scannerRef.current = scanner;
      }, 100);
      return () => clearTimeout(timer);
    } else {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            scannerRef.current = null;
        }
    }
  }, [isScanning]);

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    try {
        const data = JSON.parse(decodedText) as MatchData;
        if (data && data.match && data.id) {
            saveScan(data);
            setScans(getScans()); // Refresh list
            setIsScanning(false); // Close scanner
            alert(`Scanned Match ${data.match.number} Team ${data.match.teamNumber} successfully!`);
        } else {
            console.warn("Invalid QR Data");
        }
    } catch (e) {
        console.error("Failed to parse QR", e);
    }
  };

  const onScanFailure = (error: any) => {
    // defined but usually ignored to prevent console spam
  };

  const filteredScans = scans.filter(m => 
    m.match.teamNumber.includes(search) || 
    m.match.number.toString().includes(search)
  );

  return (
    <Box sx={{ p: '1rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1.5rem', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            Scans
        </Typography>
        <Button 
            variant="contained" 
            size="large" 
            startIcon={<QrCodeScannerIcon />}
            onClick={() => setIsScanning(true)}
        >
            Scan QR
        </Button>
      </Box>

      <Box sx={{ mb: '2rem' }}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Team # or Match #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }
            }}
        />
      </Box>

      <Grid container spacing={2}>
          {filteredScans.length === 0 ? (
            <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                    {scans.length === 0 ? "No scans yet. Press 'Scan QR' to start." : "No matches found matching your search."}
                </Typography>
            </Grid>
          ) : (
             filteredScans.slice().reverse().map((match) => (
                <Grid item xs={12} sm={6} md={4} key={match.id}>
                    <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Match {match.match.number}</Typography>
                            <Typography variant="body2" color="text.secondary">Team {match.match.teamNumber}</Typography>
                            <Typography variant="caption" color="text.disabled">{new Date(match.timestamp).toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">{(match.auto.coral.l4 * 6) + (match.teleop.coral.l4 * 4)} pts</Typography>
                        </Box>
                    </Paper>
                </Grid>
             ))
          )}
      </Grid>

      {/* Scanner Dialog */}
      <Dialog 
        open={isScanning} 
        onClose={() => setIsScanning(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setIsScanning(false)}>
                <CloseIcon />
            </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, pb: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Scan Match QR</Typography>
            <Box id="reader" sx={{ width: '100%', minHeight: '300px' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Scans;