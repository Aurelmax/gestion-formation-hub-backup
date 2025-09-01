import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, CircularProgress, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { InsertDriveFile as DocumentIcon } from '@mui/icons-material';

interface DocumentGeneratorProps {
  dossierId: string;
  buttonText?: string;
  onSuccess?: (documents: Document[]) => void;
  onError?: (error: any) => void;
}

interface Document {
  name: string;
  url: string;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  dossierId,
  buttonText = 'Générer les documents',
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[] | null>(null);

  const handleGenerateDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`/dossiers/${dossierId}/generate-documents`);
      setDocuments(response.data.documents);
      if (onSuccess) {
        onSuccess(response.data.documents);
      }
    } catch (err) {
      console.error('Erreur lors de la génération des documents:', err);
      setError('Une erreur est survenue lors de la génération des documents');
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDocumentName = (name: string) => {
    switch (name) {
      case 'convention':
        return 'Convention de formation';
      case 'attestation':
        return 'Attestation de formation';
      case 'emargement':
        return 'Feuille d\'émargement';
      case 'convocation':
        return 'Convocation';
      default:
        return name;
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      {!documents && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateDocuments}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
        </Button>
      )}

      {error && (
        <Typography color="error" variant="body1" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {documents && documents.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Documents générés:
          </Typography>
          <List>
            {documents.map((doc, index) => (
              <ListItem 
                key={index}
                component="a"
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  mb: 1,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={getDocumentName(doc.name)}
                  secondary="Cliquez pour télécharger le PDF"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default DocumentGenerator;
