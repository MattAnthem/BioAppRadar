import L from 'leaflet';

export function addRasterImage(
    uri: string,
    bounds: L.LatLngBoundsExpression,
    options?: L.GridLayerOptions & { opacity?: number }
): L.GridLayer