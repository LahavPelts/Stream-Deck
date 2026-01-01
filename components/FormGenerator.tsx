import React from 'react';
import { FieldConfig } from '../config/gameConfig';
import { getByPath } from '../utils/calculations';
import { TextField, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import CounterField from './CounterField';
import FieldSelector from './FieldSelector';

interface FormGeneratorProps {
  config: FieldConfig[];
  data: any;
  onChange: (path: string, value: any) => void;
  section: string;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ config, data, onChange, section }) => {
  // Filter fields for current section
  const fields = config.filter((f) => f.section === section);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {fields.map((field) => {
        const value = getByPath(data, field.path) ?? '';

        if (field.type === 'position') {
            return (
                <FieldSelector
                    key={field.id}
                    label={field.label}
                    value={Number(value)}
                    onChange={(val) => onChange(field.path, val)}
                />
            )
        }

        if (field.type === 'number') {
            // Use specialized CounterField for scoring, standard input for match number
            if (field.path.includes('match') || field.path.includes('Level') || field.path.includes('State')) {
                 // For Levels 1-5 or simple numbers, a counter is still good, or a slider?
                 // Requirements say "CounterField ... for things like Coral Scored"
                 return (
                    <CounterField
                      key={field.id}
                      label={field.label}
                      value={Number(value)}
                      onChange={(val) => onChange(field.path, val)}
                      min={field.min}
                      max={field.max}
                    />
                  );
            }
            return (
                <CounterField
                  key={field.id}
                  label={field.label}
                  value={Number(value)}
                  onChange={(val) => onChange(field.path, val)}
                />
            )
        }

        if (field.type === 'boolean') {
          return (
            <FormControlLabel
              key={field.id}
              control={
                <Switch
                  checked={Boolean(value)}
                  onChange={(e) => onChange(field.path, e.target.checked)}
                />
              }
              label={field.label}
              sx={{ ml: 1 }}
            />
          );
        }

        if (field.type === 'select' && field.options) {
          return (
            <FormControl key={field.id} fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={String(value)}
                label={field.label}
                onChange={(e) => onChange(field.path, e.target.value)}
              >
                {field.options.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        // Default to Text
        return (
          <TextField
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => onChange(field.path, e.target.value)}
            fullWidth
            variant="outlined"
            multiline={field.path.includes('comments')}
            rows={field.path.includes('comments') ? 3 : 1}
          />
        );
      })}
    </Box>
  );
};

export default FormGenerator;