import axios from 'axios';
import type { ICoordinates } from '../types';
import type { ILocationDetails } from '../types/location';

interface INominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  region?: string;
  state_district?: string;
  county?: string;
  country?: string;
  country_code?: string;
}

interface INominatimResponse {
  address?: INominatimAddress;
  display_name?: string;
}

export interface ICountryInfo {
  country: string;
  isoCode: string;
}

export async function reverseGeocodeDetailed(coordinates: ICoordinates): Promise<ILocationDetails | null> {
  try {
    const response = await axios.get<INominatimResponse>(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat: coordinates.latitude,
          lon: coordinates.longitude,
          format: 'json',
          zoom: 18,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'FlashEmergency/1.0',
        },
        timeout: 8000,
      },
    );

    const address = response.data.address;
    if (!address?.country_code) return null;

    const city = address.city ?? address.town ?? address.village ?? address.municipality ?? null;
    const state = address.state ?? address.region ?? address.state_district ?? address.county ?? null;

    return {
      city,
      state,
      country: address.country ?? 'Unknown',
      isoCode: address.country_code.toUpperCase(),
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(coordinates: ICoordinates): Promise<ICountryInfo | null> {
  const details = await reverseGeocodeDetailed(coordinates);
  if (!details) return null;
  return { country: details.country, isoCode: details.isoCode };
}
