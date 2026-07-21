import type { ICoordinates } from '../types';

export function buildShareMessage(coordinates: ICoordinates): string {
  return `🆘 Need help!\n\nMy current location:\nhttps://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
}

export function buildMapsUrl(coordinates: ICoordinates): string {
  return `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
}

export async function shareLocation(coordinates: ICoordinates): Promise<boolean> {
  const message = buildShareMessage(coordinates);

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Emergency - My Location',
        text: message,
        url: buildMapsUrl(coordinates),
      });
      return true;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return false;
      }
      throw err;
    }
  }

  return false;
}

export async function copyCoordinates(coordinates: ICoordinates): Promise<void> {
  const text = `${coordinates.latitude}, ${coordinates.longitude}`;
  await navigator.clipboard.writeText(text);
}

export async function copyShareMessage(coordinates: ICoordinates): Promise<void> {
  const message = buildShareMessage(coordinates);
  await navigator.clipboard.writeText(message);
}

export function vibrate(pattern: number | number[] = [200, 100, 200, 100, 400]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export function speakConfirmation(text: string = 'SOS alert sent. Help is on the way.'): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
}
