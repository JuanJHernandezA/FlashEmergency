import { useState, useEffect, useCallback } from 'react';
import type { ICoordinates } from '../types';

type GeolocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable' | 'error';

interface IGeolocationState {
  coordinates: ICoordinates | null;
  status: GeolocationStatus;
  error: string | null;
}

interface IUseGeolocationReturn extends IGeolocationState {
  requestLocation: () => void;
  isLoading: boolean;
}

function useGeolocation(): IUseGeolocationReturn {
  const [state, setState] = useState<IGeolocationState>({
    coordinates: null,
    status: 'idle',
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        status: 'unavailable',
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          status: 'granted',
          error: null,
        });
      },
      (err) => {
        let errorMessage: string;
        let status: GeolocationStatus;

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable it in your browser settings.';
            status = 'denied';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            status = 'unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'The request to get your location timed out.';
            status = 'error';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
            status = 'error';
            break;
        }

        setState({ coordinates: null, status, error: errorMessage });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
    isLoading: state.status === 'loading',
  };
}

export default useGeolocation;
