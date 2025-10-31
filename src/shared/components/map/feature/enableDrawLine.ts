import L from 'leaflet';
import "leaflet-draw";

/**
 * Enable simple line drawing on the Leaflet map instance
 * @param map Leaflet map
 * @param onLineCreated Callback fired when line is drawn
 */
export function enableDrawLine(
    map: L.Map,
    onLineCreated?: (start: L.LatLng, end: L.LatLng) => void
  ) {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
  
    const drawControls = new L.Control.Draw({
      position: "topleft",
      draw: {
        polyline: {
          shapeOptions: {
            color: "#00bfff",
            weight: 4,
          },
        },
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circleMarker: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });
  
    map.addControl(drawControls);
  
    const container: HTMLElement = drawControls._container;
    container.style.marginTop = "60px";
    container.style.marginLeft = "10px";
  
    map.on(L.Draw.Event.CREATED, (e) => {
      const event = e as L.DrawEvents.Created;
  
      if (event.layerType === "polyline") {
        const layer = event.layer as L.Polyline;
        drawnItems.addLayer(layer);
  
        const latlngs = layer.getLatLngs() as L.LatLng[];
  
        if (latlngs.length >= 2) {
          const start = latlngs[0];
          const end = latlngs[latlngs.length - 1];
  
          console.log("Start:", start.lat, start.lng);
          console.log("End:", end.lat, end.lng);
  
          if (onLineCreated) onLineCreated(start, end);
        }
      }
    });
  }
  