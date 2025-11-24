import { useEffect, useState } from "react";
import type * as LeafletType from "leaflet";

export function useLeaflet() {
    const [leaflet, setLeaflet] = useState<typeof LeafletType | null>(null);

    useEffect(() => {
        import('leaflet').then((L) => setLeaflet(L));
    }, []);

    return leaflet;
}