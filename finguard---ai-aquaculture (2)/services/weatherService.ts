
/**
 * FinGuard Weather Service
 * Integrated with Open-Meteo for real-time environmental data
 * and Nominatim for reverse geocoding.
 */

export interface WeatherData {
  temp: number;
  pressure: number;
  uvi: number;
  description: string;
  locationName?: string;
}

export const fetchWeatherByCoords = async (lat: number, lng: number): Promise<WeatherData> => {
  // 1. Fetch Weather Data from Open-Meteo
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,surface_pressure,uv_index&timezone=auto`;
  
  // 2. Fetch Place Name from Nominatim (OpenStreetMap)
  const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;

  try {
    const [weatherRes, geoRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(geoUrl, { headers: { 'Accept-Language': 'en' } })
    ]);

    if (!weatherRes.ok) throw new Error("Weather service unavailable");
    
    const weatherData = await weatherRes.json();
    const geoData = await geoRes.json();
    
    const current = weatherData.current;
    
    // Extract a readable location name (city, town, or village)
    const address = geoData.address;
    const locationName = address.city || address.town || address.village || address.suburb || address.state_district || "Unknown Location";

    return {
      temp: current.temperature_2m,
      pressure: current.surface_pressure,
      uvi: current.uv_index,
      description: "Atmospheric Sync Active",
      locationName: locationName
    };
  } catch (error) {
    console.error("Weather/Geo fetch failed:", error);
    throw error;
  }
};
