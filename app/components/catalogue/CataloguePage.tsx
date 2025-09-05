import React, { useState, useMemo, useCallback } from 'react';
import { useProgrammesCatalogue, ProgrammeFormation, CategorieFormation } from '../../hooks/useProgrammesCatalogue';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, CircularProgress, Alert, Container, Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';

// Fonction utilitaire pour formater une date
const formatDate = (dateString?: string | Date) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const CataloguePage: React.FC = () => {
  const { categories, loading, error } = useProgrammesCatalogue();
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Gérer le changement d'onglet
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  // Memoize categories with formations
  const categoriesWithFormations = useMemo(() => {
    return categories.filter(category => category.formations && category.formations.length > 0);
  }, [categories]);

  // Memoize current active category
  const activeCategory = useMemo(() => {
    return activeTab > 0 ? categories[activeTab - 1] : null;
  }, [categories, activeTab]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Catalogue de formations
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Tabs pour la navigation par catégorie */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Tous" />
              {categories.map((category: CategorieFormation, index: number) => (
                <Tab 
                  key={category.id} 
                  label={category.titre} 
                  sx={{ 
                    '&.Mui-selected': { 
                      color: category.couleur,
                    }
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Affichage des formations par catégorie */}
          {activeTab === 0 ? (
            // Affichage de toutes les catégories
            <>
              {categories.map((category: CategorieFormation) => {
                // Skip les catégories sans formations
                if (!category.formations || category.formations.length === 0) return null;
                
                return (
                  <Box key={category.id} sx={{ mb: 6 }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        sx={{
                          px: 2, 
                          py: 0.5,
                          backgroundColor: category.couleur || '#3498db',
                          color: '#fff',
                          borderRadius: 1
                        }}
                      >
                        {category.titre}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      {category.formations?.map((programme: ProgrammeFormation) => (
                        <Grid key={programme.id.toString()} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                            <Box sx={{ height: 140, bgcolor: '#f5f5f5' }} />
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Typography 
                                variant="subtitle1" 
                                component="div" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  mb: 2,
                                  minHeight: '3rem',
                                  lineHeight: 1.2
                                }}
                              >
                                {programme.titre}
                              </Typography>
                              
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  mb: 2,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  minHeight: '4.5rem'
                                }}
                              >
                                {programme.description}
                              </Typography>
                              
                              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {(programme as any).auteur || 'GestionMax'}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DateRangeIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(programme.dateModification || programme.dateCreation) || '10 mai 2024'}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {programme.duree ? `Durée: ${programme.duree}` : '5 min'}
                                </Typography>
                              </Box>
                            </CardContent>
                            
                            <CardActions sx={{ p: 2, pt: 0 }}>
                              <Link href={`/formations/${programme.id}`}>
                                <Button 
                                  fullWidth
                                  variant="contained"
                                  sx={{ 
                                    bgcolor: category.couleur || '#3498db',
                                    '&:hover': {
                                      bgcolor: category.couleur ? `${category.couleur}dd` : '#2980b9'
                                    }
                                  }}
                                >
                                  Lire l'article
                                </Button>
                              </Link>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
            </>
          ) : (
            // Affichage d'une seule catégorie
            <Box>
              {categories[activeTab - 1] && categories[activeTab - 1].formations && categories[activeTab - 1].formations.length > 0 ? (
                <Grid container spacing={3}>
                  {categories[activeTab - 1].formations?.map((programme: ProgrammeFormation) => (
                    <Grid key={programme.id.toString()} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                        <Box sx={{ height: 140, bgcolor: '#f5f5f5' }} />
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography 
                            variant="subtitle1" 
                            component="div" 
                            sx={{ 
                              fontWeight: 'bold',
                              mb: 2,
                              minHeight: '3rem',
                              lineHeight: 1.2
                            }}
                          >
                            {programme.titre}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              minHeight: '4.5rem'
                            }}
                          >
                            {programme.description}
                          </Typography>
                          
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {(programme as any).auteur || 'GestionMax'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateRangeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(programme.dateModification || programme.dateCreation) || '10 mai 2024'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {programme.duree ? `Durée: ${programme.duree}` : '5 min'}
                            </Typography>
                          </Box>
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Link href={`/formations/${programme.id}`}>
                            <Button 
                              fullWidth
                              variant="contained"
                              sx={{ 
                                bgcolor: categories[activeTab - 1].couleur || '#3498db',
                                '&:hover': {
                                  bgcolor: categories[activeTab - 1].couleur ? `${categories[activeTab - 1].couleur}dd` : '#2980b9'
                                }
                              }}
                            >
                              Lire l'article
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">Aucune formation disponible dans cette catégorie</Alert>
              )}
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CataloguePage;
