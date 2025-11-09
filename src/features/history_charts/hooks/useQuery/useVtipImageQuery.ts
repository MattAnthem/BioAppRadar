import { useQuery } from "@tanstack/react-query";
import { fetchImageVTIP, type VtipPayload } from "../../../../api/endpoints/verticalProfilesAPI";

export const useVtipImageQuery = (payload: VtipPayload, enabled?: boolean) => {
    const key = ["vtip_image", payload.parameter, payload.startTime, payload.endTime];
    return useQuery<Blob>({
        queryKey: key,
        queryFn: async () => {
            try {
                return await fetchImageVTIP(payload);
            } catch (error) {
                console.error('Failed to fetch VTIP image', error);
                throw error;
            }
        },
        enabled: (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
}