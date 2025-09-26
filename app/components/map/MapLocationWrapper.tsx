import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';

/**
 * Wrapper pour MapLocation avec import dynamique
 * Convention Hybride Stricte - SSR Safe
 */

interface MapLocationWrapperProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  popupText?: string;
  height?: string;
}

// ✅ Import dynamique avec SSR désactivé
const ClientOnlyMap = dynamic(
  () => import('./ClientOnlyMap'),
  {
    ssr: false,
    loading: () => (
      <Card className="overflow-hidden">
        <div className="w-full h-96 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-2 text-sm">Chargement de la carte...</p>
          </div>
        </div>
      </Card>
    )
  }
);

const MapLocationWrapper: React.FC<MapLocationWrapperProps> = (props) => {
  return <ClientOnlyMap {...props} />;
};

export default MapLocationWrapper;