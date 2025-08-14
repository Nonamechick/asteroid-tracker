// lib/fetchAsteroids.ts
export interface NeoItem {
  id: string;
  name: string;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: {
    close_approach_date: string;
    relative_velocity: { kilometers_per_hour: string };
    miss_distance: { kilometers: string };
  }[];
}

export async function fetchAsteroids(): Promise<NeoItem[]> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const today = new Date().toISOString().split('T')[0];
  const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const res = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${weekLater}&api_key=${apiKey}`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Failed to fetch asteroid data');

  const data = await res.json();
  const nearEarthObjects = data.near_earth_objects;
  const allAsteroids: NeoItem[] = [];

  Object.values(nearEarthObjects).forEach((day: any) => {
    day.forEach((asteroid: NeoItem) => {
      allAsteroids.push(asteroid);
    });
  });

  return allAsteroids;
}
