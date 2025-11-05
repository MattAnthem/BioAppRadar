import { useQuery } from "@tanstack/react-query";
import { fetchRadarData, type RadarGridPayload, type RadarPolarPayload, type SpatialDataResponse, } from "../../../../api/endpoints/spatialDataAPI";


export const useRadarDataQuery = (payload: RadarPolarPayload | RadarGridPayload) => {
    return useQuery<SpatialDataResponse>({
        queryKey: ["radar_data", payload.parameter, payload.colorbar, payload.time, payload.type, 'elevation_angle' in payload ? payload.elevation_angle : payload.height],
        queryFn: async () => {
            try {
                return await fetchRadarData(payload)
            } catch (error) {
                console.error('Failed to fetch Radar Data');
                throw error;
            }
        },
        enabled: Boolean(
            payload?.parameter &&
            payload.colorbar &&
            payload.time &&
            payload.type &&
            (('elevation_angle' in payload)
              ? payload.elevation_angle !== undefined
              : payload.height !== undefined)
          )
    })
};