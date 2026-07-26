import { useQuery } from '@tanstack/react-query';
import { fetchNearbyServices } from '../services/overpass';
import type { ICoordinates } from '../types';

function useNearbyServices(coordinates: ICoordinates | null) {
  return useQuery({
    queryKey: ['nearbyServices', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchNearbyServices(coordinates!),
    enabled: !!coordinates && !!coordinates.latitude && !!coordinates.longitude,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    networkMode: 'always',
  });
}

export default useNearbyServices;
