import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getMatches, importMatches, clearAllMatches } from '../services/storage';

const DataManager: React.FC = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleExport = () => {
    const data = getMatches();
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `scouting_data_${Date.now()}.json`;
    link.click();
    setMessage({ text: "Data exported successfully!", type: "success" });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            try {
                if (e.target?.result) {
                    const parsed = JSON.parse(e.target.result as string);
                    if (Array.isArray(parsed)) {
                        importMatches(parsed);
                        setMessage({ text: `Imported ${parsed.length} matches!`, type: "success" });
                    } else {
                        throw new Error("Invalid JSON format (Expected Array)");
                    }
                }
            } catch (err) {
                console.error(err);
                setMessage({ text: "Failed to import data. Invalid file.", type: "error" });
            }
        };
    }
  };

  const handleClear = () => {
      clearAllMatches();
      setConfirmOpen(false);
      setMessage({ text: "All data cleared from this device.", type: "success" });
  };

  return (
    <Box sx={{ p: '1rem', maxWidth: '40rem', mx: 'auto' }}>
      <Typography variant="h4" color="primary" sx={{ mb: '2rem', fontWeight: 700 }}>
        Data Manager
      </Typography>

      <Paper sx={{ p: '2rem', mb: '2rem' }}>
        <Typography variant="h6" gutterBottom>Transfer Data</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
            Import data from a master file or export your local matches to share with others.
        </Typography>
        
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
             <Button
                component="label"
                variant="outlined"
                startIcon={<FileUploadIcon />}
                fullWidth
                size="large"
             >
                Import JSON
                <input type="file" hidden accept=".json" onChange={handleImport} />
             </Button>
             
             <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                fullWidth
                size="large"
             >
                Export JSON
             </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: '2rem', border: '1px solid', borderColor: 'error.light', bgcolor: '#fff5f5' }}>
        <Typography variant="h6" color="error" gutterBottom>Danger Zone</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
            Clearing data will permanently delete all locally saved matches on this device. This action cannot be undone.
        </Typography>
        <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setConfirmOpen(true)}
            fullWidth
            size="large"
        >
            Clear All Data
        </Button>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete all matches?</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to delete all match data from this device? This cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '1.5rem' }}>
            <Button onClick={() => setConfirmOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleClear} color="error" variant="contained">Yes, Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar 
        open={!!message} 
        autoHideDuration={4000} 
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {message ? (
            <Alert severity={message.type} sx={{ width: '100%' }}>
                {message.text}
            </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default DataManager;