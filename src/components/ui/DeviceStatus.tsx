import { useState, useEffect } from 'react';
import { MapPin, Wifi, WifiOff, Mic, Volume2 } from 'lucide-react';
import useOnlineStatus from '../../hooks/useOnlineStatus';

interface IStatusItem {
  label: string;
  available: boolean;
  icon: typeof MapPin;
}

function DeviceStatus() {
  const isOnline = useOnlineStatus();
  const [gpsAvailable, setGpsAvailable] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const [speechAvailable] = useState(() => 'speechSynthesis' in window);

  useEffect(() => {
    setGpsAvailable('geolocation' in navigator);

    if ('mediaDevices' in navigator && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setMicAvailable(devices.some((d) => d.kind === 'audioinput'));
      }).catch(() => setMicAvailable(false));
    }
  }, []);

  const statuses: IStatusItem[] = [
    { label: 'GPS', available: gpsAvailable, icon: MapPin },
    { label: 'Internet', available: isOnline, icon: isOnline ? Wifi : WifiOff },
    { label: 'Mic', available: micAvailable, icon: Mic },
    { label: 'Speech', available: speechAvailable, icon: Volume2 },
  ];

  return (
    <div className="flex gap-2">
      {statuses.map(({ label, available, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 rounded-xl bg-background px-2.5 py-1.5"
          title={`${label}: ${available ? 'Available' : 'Unavailable'}`}
        >
          <Icon size={12} className={available ? 'text-success' : 'text-text-muted'} />
          <span className={`text-[10px] font-medium ${available ? 'text-text-secondary' : 'text-text-muted'}`}>
            {label}
          </span>
          <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-success' : 'bg-text-muted/40'}`} />
        </div>
      ))}
    </div>
  );
}

export default DeviceStatus;
