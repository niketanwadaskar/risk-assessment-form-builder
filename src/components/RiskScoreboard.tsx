// src/components/RiskScoreboard.tsx

import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import { RiskScore, FormSection } from '../types/form.types';
import { getRiskColor, getRiskDescription } from '../utils/riskCalculation';

interface RiskScoreboardProps {
  riskScore: RiskScore;
  sections: FormSection[];
}

const RiskScoreboard: React.FC<RiskScoreboardProps> = ({ riskScore, sections }) => {
  const riskColor = useMemo(() => getRiskColor(riskScore.riskLevel), [riskScore.riskLevel]);
  const riskDescription = useMemo(
    () => getRiskDescription(riskScore.riskLevel),
    [riskScore.riskLevel]
  );

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Overall Score */}
         <Grid container spacing={3} component="div">
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Overall Risk Score
              </Typography>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: riskColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: `0 0 20px rgba(0,0,0,0.2)`,
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {riskScore.totalScore}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'white' }}>
                out of 100
              </Typography>
            </Box>
          </Grid>

          {/* Risk Level & Description */}
          <Grid container spacing={3} component="div">
            <Box sx={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Risk Level
              </Typography>
              <Chip
                label={riskScore.riskLevel}
                sx={{
                  background: riskColor,
                  color: 'white',
                  fontWeight: 700,
                  width: 'fit-content',
                  mb: 2,
                }}
              />
              <Typography variant="body2" sx={{ color: 'white' }}>
                {riskDescription}
              </Typography>
            </Box>
          </Grid>

          {/* Section Breakdown */}
          <Grid container spacing={3} component="div">
            <Box sx={{ color: 'white' }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Section Breakdown
              </Typography>
              <Stack spacing={1.5}>
                {sections.map((section) => {
                  const sectionScore = riskScore.sectionScores[section.id] ?? 0;
                  const sectionColor = getSectionColor(sectionScore);

                  return (
                    <Box key={section.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'white' }}>
                          {section.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                          {Math.round(sectionScore)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={sectionScore}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: sectionColor,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const getSectionColor = (score: number): string => {
  if (score <= 25) return '#4caf50'; // Green
  if (score <= 50) return '#ff9800'; // Orange
  if (score <= 75) return '#ff5722'; // Red-orange
  return '#f44336'; // Red
};

export default RiskScoreboard;