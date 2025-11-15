import { useEffect, useRef } from "react";
import L from 'leaflet';
import "leaflet-draw";
import { enableDraw } from "./feature/enableDraw";
import { enableDrawLine } from "./feature/enableDrawLine";

type MapProps = {
  baseMap: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  boxZoom?: boolean;
  scrollWheelZoom?: boolean;
  onDrawPolygon?: (geojson: GeoJSON.Feature) => void;
  onDrawLine?: (start: L.LatLng, end: L.LatLng) => void;
  overlayImg?: {
    url: string;
    bounds: L.LatLngBoundsExpression;
    opacity?: number;
    interactive?: boolean;
  };
  overlayShapes?: GeoJSON.FeatureCollection; 
  onShapeClicked?: (geosjon: GeoJSON.Feature) => void;
  drawable: boolean;
  enableLineDraw: boolean
};

/**
 * Customized Leaflet Map 
 * @param center map center expressed with [lat, lon] 
 * @param zoom map zoom
 * @param className additional classes
 * @param boxZoom allow box zoom functionnality
 * @param onDrawLine allow allow line drawing on map
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
  overlayImg,
  drawable,
  onDrawPolygon,
  onDrawLine,
  enableLineDraw,
  overlayShapes,
  onShapeClicked
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayImgRef = useRef<L.ImageOverlay | null>(null);

  // Map initialization
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


    const zoomControl = L.control.zoom({ position: 'topleft' });
    zoomControl.addTo(map);
    const zoomContainer = zoomControl.getContainer();
    if (zoomContainer) {
      zoomContainer.style.marginTop = '60px';
      zoomContainer.style.marginLeft = '10px';
      zoomContainer.style.appearance= 'none'
    }
  
    // Add tiles
    L.tileLayer(baseMap, {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // ALlow map draw on interface
    if (drawable) enableDraw(map, onDrawPolygon);


    return () => {
      // cleanup overlays
      if (overlayImgRef.current)  map.removeLayer(overlayImgRef.current);

      // cleanup map
      map.remove();
      mapRef.current = null;
    };
  }, [boxZoom, scrollWheelZoom, baseMap]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;
    
      if (enableLineDraw) {
        enableDrawLine(map, onDrawLine);
      } 
    }, [enableLineDraw, onDrawLine]);


  // Add GeoJSON layers according to users parameters
  const overlayShapesRef = useRef<L.GeoJSON[]>([]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !overlayShapes) return;
  
    overlayShapesRef.current.forEach((layer) => map.removeLayer(layer));
    overlayShapesRef.current = [];
  
    const layer = L.geoJSON(overlayShapes, {
      style: {
        color: 'blue',
        weight: 1,
        fillOpacity: 0.0,
      },
      onEachFeature: (_, layer) => {
        layer.on('click', () => {
          if (onShapeClicked) onShapeClicked(_);
        });
      },
    }).addTo(map);

    // map.fitBounds(layer.getBounds());
  
    overlayShapesRef.current = [layer];
  }, [overlayShapes, onShapeClicked]);


  // Add/update overlays when props.overlays changes
  useEffect(() => { 
    const map = mapRef.current; 
    if (!map || !overlayImg) return; 

    console.log('NEW OVERLAY CREATED')
    // Remove old overlays 
    if (overlayImgRef.current) map.removeLayer(overlayImgRef.current); 
    // Add new overlays 
    const ovrl = L.imageOverlay(overlayImg.url, overlayImg.bounds, { opacity: overlayImg.opacity ?? 0.7, zIndex: 10, interactive: overlayImg.interactive ?? false, }).addTo(map); 
    overlayImgRef.current = ovrl; 
 
  }, [overlayImg]);
  

  return <div ref={containerRef} className={className} />;
};

export default LeafletMap;