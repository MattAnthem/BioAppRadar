import { useQuery } from "@tanstack/react-query";
import { type VtipPayload, type VtipResponse, fetchVTIP } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";


export const useVtipDataQuery = (payload: VtipPayload) => {
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
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime && payload.species),
        refetchOnWindowFocus: false,
    })
}