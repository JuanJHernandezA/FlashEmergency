import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import type { ICoordinates, IEmergencyService, EmergencyCategory } from '../../types';
import { getCategoryLabel } from '../../services/overpass';

import 'leaflet/dist/leaflet.css';

const USER_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const CATEGORY_COLORS: Record<EmergencyCategory, string> = {
  hospital: '#dc2626',
  clinic: '#16a34a',
  pharmacy: '#2563eb',
  police: '#1d4ed8',
  fire_station: '#f59e0b',
};

function createCategoryIcon(category: EmergencyCategory): L.DivIcon {
  const color = CATEGORY_COLORS[category];
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

interface IRecenterMapProps {
  coordinates: ICoordinates;
}

function RecenterMap({ coordinates }: IRecenterMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], 15, {
      animate: true,
    });
  }, [map, coordinates.latitude, coordinates.longitude]);

  return null;
}

interface IEmergencyMapProps {
  coordinates: ICoordinates;
  services?: IEmergencyService[];
  selectedServiceId?: string | null;
}

function ZoomToService({ services, selectedId }: { services: IEmergencyService[]; selectedId: string }) {
  const map = useMap();

  useEffect(() => {
    const service = services.find((s) => s.id === selectedId);
    if (service) {
      map.setView([service.latitude, service.longitude], 17, { animate: true });
    }
  }, [map, services, selectedId]);

  return null;
}

function EmergencyMap({ coordinates, services = [], selectedServiceId }: IEmergencyMapProps) {
  return (
    <MapContainer
      center={[coordinates.latitude, coordinates.longitude]}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
      style={{ minHeight: '280px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap coordinates={coordinates} />

      {/* Zoom to selected service */}
      {selectedServiceId && <ZoomToService services={services} selectedId={selectedServiceId} />}

      {/* User marker */}
      <Marker position={[coordinates.latitude, coordinates.longitude]} icon={USER_ICON}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold text-text-primary">Your Location</p>
            <p className="text-xs text-text-secondary">
              {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
            </p>
            {coordinates.accuracy && (
              <p className="text-xs text-text-secondary">
                Accuracy: ±{Math.round(coordinates.accuracy)}m
              </p>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Emergency service markers */}
      {services.map((service) => (
        <Marker
          key={service.id}
          position={[service.latitude, service.longitude]}
          icon={createCategoryIcon(service.category)}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-semibold text-text-primary">{service.name}</p>
              <p className="text-xs text-text-secondary">
                {getCategoryLabel(service.category)}
              </p>
              {service.address && (
                <p className="mt-1 text-xs text-text-secondary">{service.address}</p>
              )}
              {service.distance !== undefined && (
                <p className="mt-1 text-xs font-medium text-primary">
                  {service.distance < 1000
                    ? `${service.distance}m away`
                    : `${(service.distance / 1000).toFixed(1)}km away`}
                </p>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${coordinates.latitude},${coordinates.longitude}&destination=${service.latitude},${service.longitude}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white no-underline shadow-md transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 [&]:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default EmergencyMap;
