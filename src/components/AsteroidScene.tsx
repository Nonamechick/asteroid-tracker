'use client';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface NeoItem {
  id: string;
  name: string;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data?: {
    close_approach_date?: string;
    relative_velocity?: { kilometers_per_hour?: string };
    miss_distance?: { kilometers?: string };
  }[];
}

interface Props {
  asteroids: NeoItem[];
}

export default function AsteroidScene({ asteroids }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NeoItem | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!containerRef.current) return;

      
      const Globe = (await import('three-globe')).default;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000010); 

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
      );
      camera.position.set(0, 0, 350);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      containerRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
      });

      const starVertices = [];
      const starSizes = [];
      const starColors = [];
      
      for (let i = 0; i < 10000; i++) {
        starVertices.push(
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 4000
        );
        
        
        starSizes.push(Math.random() * 1.5);
        
        
        const colorVariation = Math.random() * 0.3;
        starColors.push(
          0.9 + colorVariation,
          0.9 + colorVariation * 0.5,
          1.0 + colorVariation * 0.3
        );
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
      starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
      
      starMaterial.vertexColors = true;
      starMaterial.sizeAttenuation = true;
      
      const starPoints = new THREE.Points(starGeometry, starMaterial);
      scene.add(starPoints);

      
      scene.add(new THREE.AmbientLight(0x404040, 0.5));
      
      const sunlight = new THREE.DirectionalLight(0xffffff, 1.5);
      sunlight.position.set(200, 100, 100);
      sunlight.castShadow = true;
      sunlight.shadow.mapSize.width = 2048;
      sunlight.shadow.mapSize.height = 2048;
      scene.add(sunlight);
      
      
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
      fillLight.position.set(-100, -50, -100);
      scene.add(fillLight);

      
      const globe = new Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor(new THREE.Color(0x88ccff))
        .atmosphereAltitude(0.2);
      globe.scale.set(100, 100, 100);
      scene.add(globe);

      
      const asteroidGroup = new THREE.Group();
      
      
      const textureLoader = new THREE.TextureLoader();
      const rockTextures = [
        textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg'),
        textureLoader.load('https://threejs.org/examples/textures/terrain/rock_02_diffuse.jpg'),
        textureLoader.load('https://threejs.org/examples/textures/terrain/rock_03_diffuse.jpg')
      ];
      
      const bumpMaps = [
        textureLoader.load('https://threejs.org/examples/textures/planets/moon_bump.jpg'),
        textureLoader.load('https://threejs.org/examples/textures/terrain/rock_02_normal.jpg'),
        textureLoader.load('https://threejs.org/examples/textures/terrain/rock_03_normal.jpg')
      ];
      
      
      const materials = rockTextures.map((tex, i) => {
        return new THREE.MeshStandardMaterial({
          map: tex,
          bumpMap: bumpMaps[i],
          bumpScale: 0.1 + Math.random() * 0.2,
          roughness: 0.7 + Math.random() * 0.3,
          metalness: Math.random() * 0.1,
          color: new THREE.Color().setHSL(
            0.05 + Math.random() * 0.1, 
            0.2 + Math.random() * 0.2, 
            0.3 + Math.random() * 0.2
          )
        });
      });

      asteroids.forEach((asteroid) => {
        const radius = Math.max(
          asteroid.estimated_diameter.meters.estimated_diameter_min,
          asteroid.estimated_diameter.meters.estimated_diameter_max
        ) / 200; 
        
        
        let baseGeometry;
        const geoType = Math.floor(Math.random() * 3);
        
        switch(geoType) {
          case 0:
            baseGeometry = new THREE.IcosahedronGeometry(radius, 2);
            break;
          case 1:
            baseGeometry = new THREE.OctahedronGeometry(radius, 1);
            break;
          case 2:
            baseGeometry = new THREE.TetrahedronGeometry(radius, 1);
            break;
        }
        
        
        const positionAttribute = baseGeometry.attributes.position;
        const originalPositions = positionAttribute.array.slice();
        
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = positionAttribute.getZ(i);
          
         
          const noiseIntensity = 0.3 + Math.random() * 0.2;
          const noiseX = (Math.random() - 0.5) * radius * noiseIntensity;
          const noiseY = (Math.random() - 0.5) * radius * noiseIntensity;
          const noiseZ = (Math.random() - 0.5) * radius * noiseIntensity;
          
          positionAttribute.setXYZ(
            i, 
            x + noiseX, 
            y + noiseY, 
            z + noiseZ
          );
        }
        
       
        for (let i = 0; i < 5; i++) {
          const craterPos = new THREE.Vector3(
            (Math.random() - 0.5) * 2 * radius,
            (Math.random() - 0.5) * 2 * radius,
            (Math.random() - 0.5) * 2 * radius
          ).normalize().multiplyScalar(radius * 0.9);
          
          for (let j = 0; j < positionAttribute.count; j++) {
            const vertexPos = new THREE.Vector3(
              positionAttribute.getX(j),
              positionAttribute.getY(j),
              positionAttribute.getZ(j)
            );
            
            const distance = vertexPos.distanceTo(craterPos);
            if (distance < radius * 0.3) {
              const pushStrength = (1 - distance / (radius * 0.3)) * radius * 0.1;
              const pushDir = vertexPos.clone().sub(craterPos).normalize();
              vertexPos.add(pushDir.multiplyScalar(pushStrength));
              positionAttribute.setXYZ(j, vertexPos.x, vertexPos.y, vertexPos.z);
            }
          }
        }
        
        baseGeometry.computeVertexNormals();
        
        
        const material = materials[Math.floor(Math.random() * materials.length)];
        
        const asteroidMesh = new THREE.Mesh(baseGeometry, material);
        asteroidMesh.castShadow = true;
        asteroidMesh.receiveShadow = true;
        
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        asteroidMesh.position.set(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 100,
          Math.sin(angle) * distance
        );
        
       
        asteroidMesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        
        asteroidMesh.userData = {
          ...asteroid,
          rotationSpeed: new THREE.Vector3(
            Math.random() * 0.01,
            Math.random() * 0.01,
            Math.random() * 0.01
          )
        };
        
        asteroidGroup.add(asteroidMesh);
      });
      
      scene.add(asteroidGroup);

      // Click detection
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const onClick = (event: MouseEvent) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(asteroidGroup.children, true);
        if (intersects.length > 0) {
          setSelectedAsteroid(intersects[0].object.userData as NeoItem);
        }
      };
      window.addEventListener('click', onClick);

      
      const clock = new THREE.Clock();
      function animate() {
        const dt = clock.getDelta();
        
        
        asteroidGroup.children.forEach(asteroid => {
          asteroid.rotation.x += asteroid.userData.rotationSpeed.x * dt * 60;
          asteroid.rotation.y += asteroid.userData.rotationSpeed.y * dt * 60;
          asteroid.rotation.z += asteroid.userData.rotationSpeed.z * dt * 60;
        });
        
        
        asteroidGroup.rotation.y += dt * 0.01;
        globe.rotation.y += dt * 0.005;
        
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      setTimeout(() => mounted && setLoading(false), 2000);

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      return () => {
        mounted = false;
        window.removeEventListener('click', onClick);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
      };
    })();
  }, [asteroids]);

  return (
    <div className="w-full h-screen relative" ref={containerRef}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <img src="/hyperspace.gif" alt="Loading..." className="w-full h-full object-cover" />
        </div>
      )}

      {!loading && selectedAsteroid && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-6 rounded-lg max-w-sm z-10 backdrop-blur-sm">
          <button
            onClick={() => setSelectedAsteroid(null)}
            className="absolute top-1 right-1 text-white text-lg hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-2">{selectedAsteroid.name}</h2>
          <p className="mb-1">
            <strong className="text-blue-300">Diameter:</strong>{' '}
            {selectedAsteroid.estimated_diameter?.meters?.estimated_diameter_max
              ? selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2) + ' m'
              : 'N/A'}
          </p>
          <p className="mb-1">
            <strong className="text-blue-300">Velocity:</strong>{' '}
            {selectedAsteroid?.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour
              ? parseFloat(
                  selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour
                ).toFixed(2) + ' km/h'
              : 'N/A'}
          </p>
          <p className="mb-1">
            <strong className="text-blue-300">Miss Distance:</strong>{' '}
            {selectedAsteroid?.close_approach_data?.[0]?.miss_distance?.kilometers
              ? parseFloat(
                  selectedAsteroid.close_approach_data[0].miss_distance.kilometers
                ).toFixed(2) + ' km'
              : 'N/A'}
          </p>
          <p className="mb-1">
            <strong className="text-blue-300">Date:</strong>{' '}
            {selectedAsteroid?.close_approach_data?.[0]?.close_approach_date || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
}