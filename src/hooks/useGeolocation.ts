import { useState, useCallback, useEffect } from 'react';

export interface Coordinates {
  lat: number;
  lon: number;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('km_coords');
    if (saved) {
      try {
        setCoords(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCoords(newCoords);
        localStorage.setItem('km_coords', JSON.stringify(newCoords));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { coords, error, loading, requestLocation };
}
