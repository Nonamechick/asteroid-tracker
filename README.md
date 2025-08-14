# Asteroid Visualization Project with Authentication

![Asteroid Visualization Screenshot](https://i.postimg.cc/nzCBGRCZ/Screenshot-2025-08-14-171024.png)

## Overview

This interactive 3D visualization displays near-Earth asteroids with secure user authentication. Built with Next.js and Three.js, it features realistic asteroid models orbiting Earth, with Clerk handling authentication and a single optimized API endpoint for data fetching.

## Key Features

- **Immersive 3D Visualization**:
  - Realistic Earth model with atmospheric effects
  - Procedurally generated asteroids with detailed surfaces
  - Dynamic lighting and starfield background

- **Secure Authentication**:
  - Powered by Clerk for seamless auth flows
  - Protected routes and API endpoints
  - User-specific asteroid favorites

- **Optimized Data Flow**:
  - Single efficient `/api/neo` endpoint
  - Cached NASA NEO data with periodic updates
  - Lightweight data structure for performance

## Getting Started

### Prerequisites
- Node.js 22+
- NASA API key (free from api.nasa.gov)
- Clerk account (free tier available)

### Installation
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your `.env.local` file:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
NASA_API_KEY=your_nasa_key_here
```

### Running Locally
```bash
npm run dev
```

## Authentication Setup

1. Create a Clerk application at [clerk.dev](https://clerk.dev)
2. Configure your preferred authentication providers
3. Add your Clerk keys to environment variables
4. Customize auth pages in the `/(auth)` directory

## API Usage

The single `/api/neo` endpoint handles all asteroid data needs:

```javascript
// Example fetch
const response = await fetch('/api/neo');
const data = await response.json();
```

**Response Format**:
```json
{
  "asteroids": [
    {
      "id": "12345",
      "name": "Asteroid (2023 AB)",
      "diameter": 150.5,
      "velocity": 15.2,
      "distance": 4500000
    }
  ],
  "timestamp": "2023-11-15T12:00:00Z"
}
```

## Deployment

### Recommended: Vercel
1. Import your repository
2. Add all environment variables
3. Enable Clerk's authentication proxy
4. Deploy!

### Other Platforms
Ensure you:
- Configure HTTPS
- Set proper redirect URLs in Clerk
- Implement caching for the API endpoint

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear documentation

## License

MIT Licensed. See LICENSE file for details.
