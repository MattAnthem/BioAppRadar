import { useQuery } from "@tanstack/react-query";
import { fetchVCrossBioClass, type CrossSectionBioClassPayload, type CrossSectionBioClassResponse } from "../../../api/endpoints/crossSectionAPI";

export const useVcrossBioclassQuery = (payload: CrossSectionBioClassPayload, enabled?: boolean) => {
    return useQuery<CrossSectionBioClassResponse>({
        queryKey: [
            "vcross_bioclass",
            payload.class,
            payload.startLat,
            payload.endLat,
            payload.startLon,
            payload.endLon,
            payload.time, 
            payload.segment
        ],
        queryFn: async () => {
            try {
                return await fetchVCrossBioClass(payload);
            } catch (error) {
                console.error('Failed to fetch vertical cross section Bioclass Data', error);
                throw error;
            }
        },
        enabled: (enabled ?? true) && 
                Boolean(
                    payload.class && 
                    payload.startLat && 
                    payload.endLat &&
                    payload.startLon &&
                    payload.endLon &&
                    payload.time
                ),
        refetchOnWindowFocus: false
    })
}