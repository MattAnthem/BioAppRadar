import { useQuery } from "@tanstack/react-query";
import { fetchRadarData, type SpatialDataResponse, type RadarPayload } from "../../../../api/endpoints/spatialDataAPI";


export const useRadarQyery = (payload: RadarPayload) => {
    return useQuery<SpatialDataResponse>({
        queryKey: ["radar_data", payload.parameter, payload.colorbar, payload.time, payload.type, payload?.elevation_angle, payload?.height],
        queryFn: async () => {
            try {
                return await fetchRadarData(payload)
            } catch (error) {
                console.error('Failed to fetch Radar Data');
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.colorbar && payload.time && payload.type && (payload?.elevation_angle || payload?.height))
    })
};