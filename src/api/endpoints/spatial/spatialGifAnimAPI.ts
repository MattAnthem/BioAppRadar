import { axiosClient } from "../../axiosClient";
import type { RadarPayload, SpatialDataResponse } from "./spatialDataAPI";


export const fetchRadarGifAnim = async (payload: RadarPayload): Promise<SpatialDataResponse> => {
    const payloadT = payload.type === "polar"
        ? {
            type: payload.type,
            parameter: payload.parameter,
            time: payload.time,
            colorbar: payload.colorbar,
            elevation_angle: payload.elevation_angle,
          }
        : {
            type: payload.type,
            parameter: payload.parameter,
            time: payload.time,
            colorbar: payload.colorbar,
            height: payload.height,
          };
    const { data } = await axiosClient.post('/get_radar_gif', payloadT);
    if (data.status !== 0) throw new Error("Error fetching Radar data");
    return data.data;
}