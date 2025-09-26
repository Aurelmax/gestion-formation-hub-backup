'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsClient } from '@/hooks/useHydrationSafe';

interface ClientOnlyMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  popupText?: string;
  height?: string;
}

/**
 * Composant Map Client-Only - Sécurisé pour l'Hydratation
 * Convention Hybride Stricte
 */
const ClientOnlyMap: React.FC<ClientOnlyMapProps> = ({
  latitude = 43.5853, // Coordonnées d'Antibes
  longitude = 7.1232,
  zoom = 15,
  popupText = "GestionMax Formation WordPress à Antibes",
  height = "400px"
}) => {
  const isClient = useIsClient();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // ✅ URL de fallback pour image statique (identique server/client)
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&markers=${latitude},${longitude},ol-marker-blue`;

  useEffect(() => {
    if (!isClient) return;

    const loadMap = async (): Promise<void> => {
      try {
        // Import dynamique de Leaflet côté client uniquement
        const [leaflet] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css')
        ]);

        const L = leaflet.default;

        // Configuration des icônes Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        // Créer la carte
        const mapContainer = document.getElementById('leaflet-map');
        if (mapContainer) {
          // Nettoyer le conteneur (sécurisé)
          const { clearElementSafely } = await import('@/lib/html-sanitizer');
          clearElementSafely(mapContainer);

          const map = L.map(mapContainer).setView([latitude, longitude], zoom);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(popupText)
            .openPopup();

          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la carte:', error);
        setMapError(true);
      }
    };

    loadMap();
  }, [isClient, latitude, longitude, zoom, popupText]);

  // ✅ Structure HTML identique server/client
  if (!isClient) {
    return (
      <Card className="overflow-hidden">
        <div
          style={{ height, backgroundImage: `url(${staticMapUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="w-full flex items-center justify-center bg-gray-200"
        >
          <div className="bg-white/90 p-4 rounded-lg shadow-lg">
            <p className="text-gray-700 font-medium">📍 {popupText}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card className="overflow-hidden">
        <div
          style={{ height, backgroundImage: `url(${staticMapUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="w-full flex items-center justify-center bg-gray-200"
        >
          <div className="bg-white/90 p-4 rounded-lg shadow-lg">
            <p className="text-gray-700 font-medium">📍 {popupText}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {!mapLoaded && (
        <div
          style={{ height, backgroundImage: `url(${staticMapUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="w-full flex items-center justify-center bg-gray-200"
        >
          <div className="bg-white/90 p-4 rounded-lg shadow-lg">
            <p className="text-gray-700 font-medium">🔄 Chargement de la carte...</p>
          </div>
        </div>
      )}
      <div
        id="leaflet-map"
        style={{ height, display: mapLoaded ? 'block' : 'none' }}
        className="w-full"
      />
    </Card>
  );
};

export default ClientOnlyMap;