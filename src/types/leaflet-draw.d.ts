import * as L from 'leaflet';

declare module "leaflet" {
    namespace Control {
        class Draw extends L.Control {
            _container: HTMLElement;
            constructor(options?: unknown);
        }
    }

    namespace DrawEvents {
        interface Created extends L.LeafletEvent {
          layerType: string;
          layer: L.Layer;
        }
    
        interface Edited extends L.LeafletEvent {
          layers: L.LayerGroup<L.Layer>;
        }
    
        interface Deleted extends L.LeafletEvent {
          layers: L.LayerGroup<L.Layer>;
        }
    }

    namespace Draw {
        namespace Event {
            const CREATED: string;
            const EDITED: string;
            const DELETED: string;
        }
    }
}