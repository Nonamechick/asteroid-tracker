'use client';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">Asteroid Tracker 🌌</h1>
        <p className="text-lg text-gray-300 mb-8">
          Track near-Earth objects in real-time using data from NASA’s NeoWs API.  
          Visualize asteroid positions, sizes, and potential hazards in an interactive 3D environment powered by Three.js.
            For the best experience, please use a desktop or laptop. Mobile devices are not recommended.
        </p>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-indigo-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 transition">
              Sign In to Start
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link href="/tracker">
            <button className="bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-500 transition">
              Enter Tracker
            </button>
          </Link>
          <div className="mt-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
