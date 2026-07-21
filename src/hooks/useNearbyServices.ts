import { useQuery } from '@tanstack/react-query';
import { fetchNearbyServices } from '../services/overpass';
import type { ICoordinates } from '../types';

function useNearbyServices(coordinates: ICoordinates | null) {
  return useQuery({
    queryKey: ['nearbyServices', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchNearbyServices(coordinates!),
    enabled: !!coordinates,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export default useNearbyServices;
