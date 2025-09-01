import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Nous utilisons une approche dynamique pour charger Leaflet côté client uniquement
// afin d'éviter les problèmes de SSR et de typage TypeScript
const MapLocation = ({
  latitude = 43.5853, // Coordonnées d'Antibes
  longitude = 7.1232,
  zoom = 15,
  popupText = "GestionMax Formation WordPress à Antibes",
  height = "400px"
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Vérifier que nous sommes côté client
    setIsClient(true);
    
    // Nettoyer la carte lors du démontage
    return () => {
      // Cleanup
    };
  }, []);

  // Générer l'URL de l'image statique OpenStreetMap comme solution de repli
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&markers=${latitude},${longitude},ol-marker-blue`;

  // Injecter le script Leaflet lorsque le composant est monté côté client
  useEffect(() => {
    if (!isClient) return;

    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Nettoyer le conteneur pour éviter les doublons
    mapContainer.innerHTML = '';

    const loadLeaflet = async () => {
      try {
        // Importer dynamiquement les modules Leaflet
        const L = await import('leaflet');
        
        // Correction du problème d'icônes
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        // Créer la carte
        const map = L.map(mapContainer).setView([latitude, longitude], zoom);
        
        // Ajouter le layer de tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Ajouter le marqueur
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(popupText)
          .openPopup();

        // Ajuster la taille lors du redimensionnement
        const resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        
        resizeObserver.observe(mapContainer);
        
        // Forcer une mise à jour de la taille après le rendu
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
        
        return () => {
          map.remove();
          resizeObserver.disconnect();
        };
      } catch (error) {
        console.error('Erreur lors du chargement de la carte Leaflet:', error);
      }
    };
    
    loadLeaflet();
  }, [isClient, latitude, longitude, zoom, popupText]);

  return (
    <Card className="overflow-hidden shadow-lg border border-gray-200">
      <div style={{ height }}>
        {isClient ? (
          <div id="map-container" style={{ height: '100%', width: '100%' }}></div>
        ) : (
          // Solution de repli pour le SSR ou si Leaflet n'est pas chargé
          <img 
            src={staticMapUrl} 
            alt="Carte de localisation GestionMax Formation" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        )}
      </div>
      <div className="p-2 bg-white text-xs text-center text-gray-500">
        Formation WordPress professionnelle à Antibes | GestionMax Formation
      </div>
    </Card>
  );
};

export default MapLocation;
