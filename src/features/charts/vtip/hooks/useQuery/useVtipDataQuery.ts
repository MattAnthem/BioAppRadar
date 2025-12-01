import { useQuery } from "@tanstack/react-query";
import { fetchVTIP, type VtipPayload, type VtipResponse } from "../../../../../api/endpoints/verical_profile/verticalProfilesAPI";


export const useVtipDataQuery = (payload: VtipPayload, enabled?: boolean) => {
    return useQuery<VtipResponse>({
        queryKey: ["vtip_data", payload.startTime, payload.endTime, payload.parameter, payload.species],
        queryFn: async () => {
            try{
                return await fetchVTIP(payload);
            } catch (error) {
                console.error('Failed to fetch VTPI data');
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime && payload.species) && (enabled ?? true),
        refetchOnWindowFocus: false,
    })
}