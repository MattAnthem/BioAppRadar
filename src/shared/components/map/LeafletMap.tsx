import { useEffect, useRef } from "react";
import L from 'leaflet';
import "leaflet-draw";
import { enableDraw } from "./feature/enableDraw";

type MapProps = {
  baseMap: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  boxZoom?: boolean;
  scrollWheelZoom?: boolean;
  onReady?: (map: L.Map) => void;
  onDrawPolygon?: (geojson: GeoJSON.Feature) => void;
  overlayImg?: {
    url: string;
    bounds: L.LatLngBoundsExpression;
    opacity?: number;
    interactive?: boolean;
  };
  overlayShapes?: GeoJSON.Feature[]; 
  onShapeClicked?: (geosjon: GeoJSON.Feature) => void;
  markers?: Array<{
    iconUrl: string;
    position: [number, number];
    popup?: string;
  }>;
  drawable: boolean;
};



/**
 * Customized Leaflet Map 
 * @param center map center expressed with [lat, lon] 
 * @param zoom map zoom
 * @param className additional classes
 * @param boxZoom allow box zoom functionnality
 * @param scrollWheelZoom allow scroll wheel zoom functionnality
 * @param overlayImg image overlay 
 * @param overlayShapes GeoJson polygons overlay (eg: cities, regions, parks, airports)
 * @param onShapeClicked enable click event on the geojson shapes to get their coordinates outside the map component
 * @returns React.JSX.Element
 */
const LeafletMap = ({
  baseMap,
  center = [0, 0],
  zoom = 5,
  className = "w-full h-full",
  boxZoom = false,
  scrollWheelZoom = false,
  onReady,
  overlayImg,
  markers = [],
  drawable,
  onDrawPolygon,
  overlayShapes,
  onShapeClicked
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayImgRef = useRef<L.ImageOverlay | null>(null);
  
  const markerRefs = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      boxZoom,
      scrollWheelZoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Add tiles
    L.tileLayer(baseMap, {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // ALlow map draw on interface
    if (drawable) enableDraw(map, onDrawPolygon);

    // Callback
    if (onReady) onReady(map);

    return () => {
      // cleanup overlays
      if (overlayImgRef.current)  map.removeLayer(overlayImgRef.current);
      

      // cleanup markers
      markerRefs.current.forEach((m) => map.removeLayer(m));
      markerRefs.current = [];

      // cleanup map
      map.remove();
      mapRef.current = null;
    };
  }, [boxZoom, scrollWheelZoom, baseMap]);


  // Add GeoJSON layers according to users parameters
  const overlayShapesRef = useRef<L.GeoJSON[]>([]);
  useEffect(() => {

    const map = mapRef.current;
    if (!map || !overlayShapes) return;

    // Remove old shapes
    if (overlayShapesRef.current) overlayShapesRef.current.forEach((ovrl) => map.removeLayer(ovrl));
    overlayShapesRef.current = [];

    // Add coverage overlays
    const ovrls = overlayShapes.map((shape) => {
      const layer = L.geoJSON(shape, {style: {color: 'blue',  stroke: true, weight: 1, fillOpacity: 0.0}});
      layer.addTo(map);
      // Retrieve coordinates while we click on this shape
      layer.on('click', () => {
        if (onShapeClicked) onShapeClicked(shape);
      })

      return layer;
    })


    overlayShapesRef.current = ovrls;


  }, [onShapeClicked, overlayShapes]);


  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Add/update overlays when props.overlays changes
  useEffect(() => { 
    const map = mapRef.current; 
    if (!map || !overlayImg) return; 
    // Remove old overlays 
    if (overlayImgRef.current) map.removeLayer(overlayImgRef.current); 
    // Add new overlays 

    const ovrl = L.imageOverlay(overlayImg.url, overlayImg.bounds, { opacity: overlayImg.opacity ?? 0.7, interactive: overlayImg.interactive ?? false, }).addTo(map); 
    overlayImgRef.current = ovrl; 
    
 
  }, [overlayImg]);
  

  // Add/update markers when props.markers changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markerRefs.current.forEach((m) => map.removeLayer(m));
    markerRefs.current = [];

    // Add new markers
    markers.forEach((m) => {
      const marker = L.marker(
        m.position,
        {        
          icon: L.icon({
            iconUrl: m.iconUrl,
            iconSize: [20, 20],
          })
        }
      ).addTo(map);
      if (m.popup) marker.bindPopup(m.popup);
      markerRefs.current.push(marker);
    });
  }, [markers]);

  return <div ref={containerRef} className={className} />;
};

export default LeafletMap;