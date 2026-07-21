export interface IPhotoReport {
  id: string;
  imageDataUrl: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  createdAt: string;
}
