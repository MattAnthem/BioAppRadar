import { useQuery } from "@tanstack/react-query";
import { type VtipPayload, type VtipResponse, fetchVTIP } from "../../../api/endpoints/verticalProfilesAPI";


export const useVtipDataQuery = (payload: VtipPayload) => {
    return useQuery<VtipResponse>({
        queryKey: ["vtip_data", payload.startTime, payload.endTime, payload.parameter],
        queryFn: () => fetchVTIP(payload),
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime),
    })
}