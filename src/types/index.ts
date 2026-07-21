export interface ICoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface IEmergencyService {
  id: string;
  name: string;
  category: EmergencyCategory;
  distance?: number;
  address?: string;
  latitude: number;
  longitude: number;
}

export interface IEmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation?: string;
}

export interface IHistoryEntry {
  id: string;
  type: 'search' | 'ai_chat';
  description: string;
  createdAt: Date;
}

export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export type EmergencyCategory =
  | 'hospital'
  | 'clinic'
  | 'pharmacy'
  | 'police'
  | 'fire_station';

export type EmergencyType =
  | 'bleeding'
  | 'heart_attack'
  | 'burns'
  | 'fractures'
  | 'choking'
  | 'poisoning'
  | 'car_accident'
  | 'allergic_reaction'
  | 'animal_bite'
  | 'snake_bite'
  | 'loss_of_consciousness';
