export type MeasurementSystem = 'metric' | 'imperial';

export interface ILocationDetails {
  city: string | null;
  state: string | null;
  country: string;
  isoCode: string;
}

export interface ILocationContext {
  location: ILocationDetails | null;
  measurementSystem: MeasurementSystem;
  emergencyNumber: string;
  language: string;
  isDetecting: boolean;
}
