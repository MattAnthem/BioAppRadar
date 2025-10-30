import { useQuery } from "@tanstack/react-query";
import { type VpResponse, type VpPayload, fetchVP } from "../../../api/endpoints/verticalProfilesAPI";


export const useVpDataQuery = (payload: VpPayload) => {
    return useQuery<VpResponse>({
        queryKey: ["vp_data", payload.time, payload.parameter],
        queryFn: () => fetchVP(payload),
        enabled: Boolean(payload.parameter && payload.time),
    })
}