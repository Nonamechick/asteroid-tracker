import { currentUser } from '@clerk/nextjs/server';
import AsteroidScene from '@/components/AsteroidScene';
import { fetchAsteroids } from '@/lib/fetchAsteroids'; 

export default async function TrackerPage() {
  const user = await currentUser();
  if (!user) return null; // Clerk will redirect to sign-in automatically

  const asteroids = await fetchAsteroids();

  return (
    <div className="w-full h-full">
      <AsteroidScene asteroids={asteroids} />
    </div>
  );
}
