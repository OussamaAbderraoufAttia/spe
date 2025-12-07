"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Incident {
    id: number;
    title: string;
    latitude: number;
    longitude: number;
    status: string;
}

interface MapProps {
    incidents?: Incident[];
}

const Map = ({ incidents = [] }: MapProps) => {
    // Algiers Center
    const position: [number, number] = [36.75, 3.05];

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {incidents.map((incident) => (
                <Marker key={incident.id} position={[incident.latitude, incident.longitude]}>
                    <Popup>
                        <div className="font-medium text-sm">
                            {incident.title} <br />
                            <span className={`text-xs ${incident.status === 'COMPLETED' ? 'text-green-600' :
                                    incident.status === 'PENDING' ? 'text-yellow-600' : 'text-blue-600'
                                }`}>
                                {incident.status}
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
