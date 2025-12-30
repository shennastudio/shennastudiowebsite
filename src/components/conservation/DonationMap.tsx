'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MAP_CENTER,
  MAP_ZOOM,
  CONSERVATION_REGIONS,
  CONSERVATION_PARTNERS,
  DONATION_STATS,
  MAP_TILES,
  type ConservationPartner,
  type ConservationRegion,
} from '@/lib/map-config';

// Fix for default marker icons in Leaflet with webpack
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom emoji marker
function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<div class="emoji-marker">${emoji}</div>`,
    className: 'custom-emoji-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

// Map legend component
function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
      <h4 className="font-bold text-gray-900 mb-3 text-sm">Conservation Impact</h4>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-teal-500 opacity-60"></div>
          <span>Protected Regions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🐢</span>
          <span>Conservation Partners</span>
        </div>
        <div className="pt-2 border-t border-gray-200 mt-2">
          <div className="font-semibold text-teal-600">
            ${DONATION_STATS.totalDonated.toLocaleString()} Total Donated
          </div>
          <div className="text-gray-500">
            {DONATION_STATS.projectsSupported} Projects Supported
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats panel
function StatsPanel() {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
      <h4 className="font-bold text-gray-900 mb-3 text-sm">Live Impact Stats</h4>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="text-center p-2 bg-teal-50 rounded-lg">
          <div className="text-lg font-bold text-teal-600">
            ${DONATION_STATS.totalDonated.toLocaleString()}
          </div>
          <div className="text-gray-600">Donated</div>
        </div>
        <div className="text-center p-2 bg-cyan-50 rounded-lg">
          <div className="text-lg font-bold text-cyan-600">
            {DONATION_STATS.projectsSupported}
          </div>
          <div className="text-gray-600">Projects</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {DONATION_STATS.speciesProtected}
          </div>
          <div className="text-gray-600">Species</div>
        </div>
        <div className="text-center p-2 bg-emerald-50 rounded-lg">
          <div className="text-lg font-bold text-emerald-600">
            {DONATION_STATS.acresProtected.toLocaleString()}
          </div>
          <div className="text-gray-600">Acres</div>
        </div>
      </div>
    </div>
  );
}

// Partner popup content
function PartnerPopup({ partner }: { partner: ConservationPartner }) {
  return (
    <div className="min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{partner.icon}</span>
        <h3 className="font-bold text-gray-900">{partner.name}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{partner.description}</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Donated:</span>
          <span className="font-semibold text-teal-600">
            ${partner.donatedAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Projects:</span>
          <span className="font-semibold">{partner.projectsSupported}</span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <div className="text-gray-500 text-xs mb-1">Focus Areas:</div>
          <div className="flex flex-wrap gap-1">
            {partner.focus.map((area) => (
              <span
                key={area}
                className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg py-2 transition-colors"
        >
          Visit Website →
        </a>
      )}
    </div>
  );
}

// Region popup content
function RegionPopup({ region }: { region: ConservationRegion }) {
  return (
    <div className="min-w-[180px]">
      <h3 className="font-bold text-gray-900 mb-2">{region.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{region.description}</p>
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-3">
        <div className="text-sm text-gray-500">Donations to this region:</div>
        <div className="text-xl font-bold text-teal-600">
          ${region.totalDonated.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Map controls component
function MapControls({ mapStyle, onStyleChange }: {
  mapStyle: 'default' | 'satellite';
  onStyleChange: (style: 'default' | 'satellite') => void;
}) {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => onStyleChange('default')}
        className={`px-3 py-2 text-xs font-medium transition-colors ${
          mapStyle === 'default'
            ? 'bg-teal-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Map
      </button>
      <button
        onClick={() => onStyleChange('satellite')}
        className={`px-3 py-2 text-xs font-medium transition-colors ${
          mapStyle === 'satellite'
            ? 'bg-teal-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Satellite
      </button>
    </div>
  );
}

// Animated fly to location
function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, MAP_ZOOM, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function DonationMap() {
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite'>('default');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">🗺️</div>
          <p className="text-gray-600">Loading conservation map...</p>
        </div>
      </div>
    );
  }

  const tileConfig = MAP_TILES[mapStyle];

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <style jsx global>{`
        .custom-emoji-icon {
          background: transparent;
          border: none;
        }
        .emoji-marker {
          font-size: 32px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .emoji-marker:hover {
          transform: scale(1.2);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer url={tileConfig.url} attribution={tileConfig.attribution} />

        {/* Conservation regions as circles */}
        {CONSERVATION_REGIONS.map((region) => (
          <Circle
            key={region.id}
            center={[region.coordinates.lat, region.coordinates.lng]}
            radius={region.radius}
            pathOptions={{
              color: region.color,
              fillColor: region.color,
              fillOpacity: 0.2,
              weight: 2,
            }}
            eventHandlers={{
              click: () => setSelectedRegion(region.id),
            }}
          >
            <Popup>
              <RegionPopup region={region} />
            </Popup>
          </Circle>
        ))}

        {/* Partner markers */}
        {CONSERVATION_PARTNERS.map((partner) => (
          <Marker
            key={partner.id}
            position={[partner.coordinates.lat, partner.coordinates.lng]}
            icon={createEmojiIcon(partner.icon)}
          >
            <Popup>
              <PartnerPopup partner={partner} />
            </Popup>
          </Marker>
        ))}

        {selectedRegion && (
          <FlyToLocation
            center={[
              CONSERVATION_REGIONS.find((r) => r.id === selectedRegion)!.coordinates.lat,
              CONSERVATION_REGIONS.find((r) => r.id === selectedRegion)!.coordinates.lng,
            ]}
          />
        )}
      </MapContainer>

      <MapLegend />
      <StatsPanel />
      <MapControls mapStyle={mapStyle} onStyleChange={setMapStyle} />
    </div>
  );
}
