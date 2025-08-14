import { NextResponse } from 'next/server';

type NeoApi = {
  near_earth_objects: Record<string, Array<{
    id: string;
    name: string;
    estimated_diameter: { meters: { estimated_diameter_min: number; estimated_diameter_max: number; } };
    close_approach_data: Array<{
      close_approach_date_full?: string;
      relative_velocity: { kilometers_per_second: string };
      miss_distance: { kilometers: string };
      orbiting_body: string;
    }>;
    is_potentially_hazardous_asteroid: boolean;
  }>>;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start') ?? new Date().toISOString().slice(0,10);
  const end   = searchParams.get('end')   ?? start;
  const key   = process.env.NASA_API_KEY;

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${key}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) throw new Error(`NASA API ${res.status}`);
    const data: NeoApi = await res.json();

    // Flatten + normalize for the client 3D view
    const items = Object.values(data.near_earth_objects).flat().map((neo) => {
      const ca = neo.close_approach_data[0];
      const diameterM =
        (neo.estimated_diameter.meters.estimated_diameter_min +
         neo.estimated_diameter.meters.estimated_diameter_max) / 2;

      return {
        id: neo.id,
        name: neo.name.replace(/[()]/g,''),
        date: ca?.close_approach_date_full ?? '',
        velocityKmS: parseFloat(ca?.relative_velocity.kilometers_per_second ?? '0'),
        missDistanceKm: parseFloat(ca?.miss_distance.kilometers ?? '0'),
        diameterM,
        hazardous: neo.is_potentially_hazardous_asteroid,
        orbitingBody: ca?.orbiting_body ?? 'Earth',
      };
    });

    return NextResponse.json({ start, end, count: items.length, items });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
