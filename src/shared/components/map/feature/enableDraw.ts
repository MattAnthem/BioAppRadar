import L from 'leaflet';
import "leaflet-draw";

/**
 * Enable Polygon drawing on the leaflet map instance
 * @param map Leaflet map
 */
export function enableDraw (map: L.Map, onPolygonCreated?: (geojson: GeoJSON.Feature) => void) {


    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // config of drawing items
    const drawControls = new L.Control.Draw({
        position: "topleft",
        draw: {
            polygon: {
                allowIntersection: false,
                shapeOptions: {
                    color: "#ff0000",
                    fillColor: '#ff6666',
                    fillOpacity: 0.4,
                }
            },
            rectangle: false,
            circle: false,
            polyline: false,
            marker: false,
            circleMarker: false
        },
        edit: {
            featureGroup: drawnItems
        }
    })

    map.addControl(drawControls);

    const container: HTMLElement = drawControls._container;
    container.style.marginTop = '60px';
    container.style.marginLeft = '10px';

    // Finished drawing a polygon
    map.on(L.Draw.Event.CREATED, (e) => {
        const event = e as L.DrawEvents.Created;
        const layer = event.layer;
        drawnItems.addLayer(layer);
          
        const geojson = (layer as L.GeoJSON).toGeoJSON() as GeoJSON.Feature;

        if (onPolygonCreated) onPolygonCreated(geojson);
    
    });
          
          
    map.on(L.Draw.Event.EDITED, (e) => {
        const event = e as L.DrawEvents.Edited;
        event.layers.eachLayer((layer: L.Layer) => {
              if ("toGeoJSON" in layer) {
                const geojson = (layer as L.GeoJSON).toGeoJSON() as GeoJSON.Feature;
                if (onPolygonCreated) onPolygonCreated(geojson);
              }
        });
    });
          
    map.on(L.Draw.Event.DELETED, (e) => {
        const event = e as L.DrawEvents.Deleted;
            event.layers.eachLayer((layer: L.Layer) => {
              console.log("Polygone supprimé :", (layer as L.GeoJSON).toGeoJSON());
        });
    });

}