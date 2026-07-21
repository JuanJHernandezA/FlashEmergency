import { useState, useCallback } from 'react';
import type { IMedicalProfile } from '../types/medicalProfile';

const STORAGE_KEY = 'flashemergency-medical-profile';

function getStoredProfile(): IMedicalProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as IMedicalProfile) : null;
  } catch {
    return null;
  }
}

function useMedicalProfile() {
  const [profile, setProfile] = useState<IMedicalProfile | null>(getStoredProfile);

  const saveProfile = useCallback((data: IMedicalProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setProfile(data);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return { profile, saveProfile, clearProfile };
}

export default useMedicalProfile;
