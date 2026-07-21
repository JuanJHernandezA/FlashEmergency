export interface IEmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
  general?: string;
}

export interface ICountryEmergency {
  country: string;
  isoCode: string;
  numbers: IEmergencyNumbers;
  primary: string;
}

const EMERGENCY_NUMBERS: Record<string, ICountryEmergency> = {
  US: { country: 'United States', isoCode: 'US', numbers: { police: '911', ambulance: '911', fire: '911' }, primary: '911' },
  CO: { country: 'Colombia', isoCode: 'CO', numbers: { police: '123', ambulance: '125', fire: '119', general: '123' }, primary: '123' },
  ES: { country: 'Spain', isoCode: 'ES', numbers: { police: '112', ambulance: '112', fire: '112', general: '112' }, primary: '112' },
  GB: { country: 'United Kingdom', isoCode: 'GB', numbers: { police: '999', ambulance: '999', fire: '999', general: '999' }, primary: '999' },
  MX: { country: 'Mexico', isoCode: 'MX', numbers: { police: '911', ambulance: '911', fire: '911' }, primary: '911' },
  AR: { country: 'Argentina', isoCode: 'AR', numbers: { police: '101', ambulance: '107', fire: '100', general: '911' }, primary: '911' },
  CL: { country: 'Chile', isoCode: 'CL', numbers: { police: '133', ambulance: '131', fire: '132' }, primary: '131' },
  PE: { country: 'Peru', isoCode: 'PE', numbers: { police: '105', ambulance: '116', fire: '116' }, primary: '105' },
  BR: { country: 'Brazil', isoCode: 'BR', numbers: { police: '190', ambulance: '192', fire: '193' }, primary: '192' },
  DE: { country: 'Germany', isoCode: 'DE', numbers: { police: '110', ambulance: '112', fire: '112' }, primary: '112' },
  FR: { country: 'France', isoCode: 'FR', numbers: { police: '17', ambulance: '15', fire: '18', general: '112' }, primary: '112' },
  IT: { country: 'Italy', isoCode: 'IT', numbers: { police: '113', ambulance: '118', fire: '115', general: '112' }, primary: '112' },
  AU: { country: 'Australia', isoCode: 'AU', numbers: { police: '000', ambulance: '000', fire: '000' }, primary: '000' },
  CA: { country: 'Canada', isoCode: 'CA', numbers: { police: '911', ambulance: '911', fire: '911' }, primary: '911' },
  IN: { country: 'India', isoCode: 'IN', numbers: { police: '100', ambulance: '108', fire: '101', general: '112' }, primary: '112' },
  JP: { country: 'Japan', isoCode: 'JP', numbers: { police: '110', ambulance: '119', fire: '119' }, primary: '119' },
};

const DEFAULT_EMERGENCY: ICountryEmergency = {
  country: 'International',
  isoCode: '',
  numbers: { police: '112', ambulance: '112', fire: '112', general: '112' },
  primary: '112',
};

export function getEmergencyNumbers(isoCode: string): ICountryEmergency {
  return EMERGENCY_NUMBERS[isoCode.toUpperCase()] ?? DEFAULT_EMERGENCY;
}

export default EMERGENCY_NUMBERS;
