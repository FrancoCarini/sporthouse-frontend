import Image from 'next/image'
import ReactMapGl, { Marker } from 'react-map-gl'
import { useState } from 'react'
import { MAPBOX_TOKEN } from '@/config/index'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function StoreMap({ coordinates }) {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '400px',
    latitude: coordinates[1],
    longitude: coordinates[0],
    zoom: 14
  });


  return (
    <ReactMapGl {...viewport} mapboxApiAccessToken={MAPBOX_TOKEN} onViewportChange={vp => setViewport(vp)}>
      <Marker key={123} latitude={coordinates[1]} longitude={coordinates[0]}>
        <Image src='/images/pin.svg' width={30} height={30} />
      </Marker>
    </ReactMapGl>
  )
}
