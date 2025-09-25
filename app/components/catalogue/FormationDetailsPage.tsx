"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ProgrammeFormation } from '@/types';

const FormationDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [formation, setFormation] = useState<ProgrammeFormation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormationDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/programmes-formation/${id}`);
        setFormation(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des détails de la formation:", err);
        setError("Impossible de charger les détails de cette formation");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFormationDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !formation) {
    return (
      <Box p={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.back()} 
          sx={{ mb: 2 }}
        >
          Retour au catalogue
        </Button>
        <Alert severity="error">
          {error || "Cette formation n'est pas disponible"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.back()} 
        sx={{ mb: 2 }}
      >
        Retour au catalogue
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          {formation.pictogramme && (
            <Typography variant="h1" component="span" sx={{ fontSize: '3rem' }}>
              {formation.pictogramme}
            </Typography>
          )}
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {formation.titre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {formation.code}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography paragraph>{formation.description}</Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Objectifs</Typography>
            <List>
              {formation.objectifs.map((objectif, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={objectif} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Prérequis</Typography>
            <Typography paragraph>{formation.prerequis}</Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Public concerné</Typography>
            <Typography paragraph>{(formation as any).publicConcerne || "Tous professionnels souhaitant développer leurs compétences dans ce domaine."}</Typography>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>Informations pratiques</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Durée</Typography>
                <Typography>{formation.duree}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Prix</Typography>
                <Typography>{formation.prix}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Niveau</Typography>
                <Typography>{formation.niveau}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Participants</Typography>
                <Typography>{formation.participants}</Typography>
              </Box>
              
              {formation.categorie && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Catégorie</Typography>
                  <Chip 
                    label={formation.categorie.nom} 
                    size="small"
                    sx={{ 
                      bgcolor: (formation.categorie as any).couleur || 'primary.main', 
                      color: '#fff',
                      mt: 0.5
                    }} 
                  />
                </Box>
              )}

              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  href={`/contact?formation=${formation.id}`}
                >
                  Demander un devis
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FormationDetailsPage;
