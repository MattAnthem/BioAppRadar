import { useQuery } from "@tanstack/react-query";
import { fetchImageVP, type VpPayload } from "../../../../../api/endpoints/verical_profile/verticalProfilesAPI";

export const useVpImageQuery = (payload: VpPayload, enabled?: boolean) => {
    const queryKey = [
        "vp_image", 
        payload.time,
        payload.parameter,
        payload.species
    ]
    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchImageVP(payload);
            } catch (error) {
                console.error('Failed to fetch VP image ', error);
                throw error;
            }
        },
        enabled: enabled ?? true,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
}