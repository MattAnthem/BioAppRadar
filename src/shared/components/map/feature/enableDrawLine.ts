import L from 'leaflet';
import "leaflet-draw";

/**
 * Enable simple line drawing on the Leaflet map instance
 * @param map Leaflet map
 * @param onLineCreated Callback fired when line is drawn
 */
type LineDrawEnabledMap = L.Map & {
  _lineDrawEnabled?: boolean;
  _disableLineDraw?: () => void;
};

export function enableDrawLine(
  map: L.Map,
  onLineCreated?: (start: L.LatLng, end: L.LatLng) => void
) {
  const typedMap = map as LineDrawEnabledMap;

  if (typedMap._lineDrawEnabled) {
    return;
  }
  typedMap._lineDrawEnabled = true;

  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControls = new L.Control.Draw({
    position: "topleft",
    draw: {
      polyline: { 
        shapeOptions: { color: "#d60808", weight: 4, fillOpacity: 1 },
        allowIntersection: false,
        repeatMode: false
      },
      polygon: false,
      rectangle: false,
      circle: false,
      marker: false,
      circleMarker: false
    },
    edit: {
      featureGroup: drawnItems,
      edit: false,     
      remove: true      
    }
  });

  map.addControl(drawControls); 


  const container: HTMLElement = drawControls._container;
  container.style.marginTop = "60px";
  container.style.marginLeft = "10px";

  if (container) {
    const circleMarkerBtn = container.querySelector(".leaflet-draw-draw-circlemarker");
    circleMarkerBtn?.remove();
  }

  const handleCreated = (event: L.LeafletEvent) => {
    const e = event as L.DrawEvents.Created;
    if (e.layerType === "polyline") {
      const layer = e.layer as L.Polyline;
      drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs() as L.LatLng[];
      if (latlngs.length >= 2) {
        const start = latlngs[0];
        const end = latlngs[latlngs.length - 1];
        onLineCreated?.(start, end);
      }
    }
  };

  map.on(L.Draw.Event.CREATED, handleCreated);

  typedMap._disableLineDraw = () => {
    map.off(L.Draw.Event.CREATED, handleCreated);
    map.removeLayer(drawnItems);
    map.removeControl(drawControls);
    delete typedMap._lineDrawEnabled;
    delete typedMap._disableLineDraw;
  };
}
