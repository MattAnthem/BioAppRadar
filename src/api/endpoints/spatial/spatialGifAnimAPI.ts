import { axiosClient } from "../../axiosClient";
import type { RadarPayload, SevipPayload, SpatialDataResponse } from "./spatialDataAPI";


export const fetchRadarGifAnim = async (payload: RadarPayload): Promise<SpatialDataResponse> => {
    const payloadT = payload.type === "polar"
        ? {
            type: payload.type,
            parameter: payload.parameter,
            startTime: payload.startTime,
            endTime: payload.endTime,
            colorbar: payload.colorbar,
            elevation_angle: payload.elevation_angle,
          }
        : {
            type: payload.type,
            parameter: payload.parameter,
            startTime: payload.startTime,
            endTime: payload.endTime,
            colorbar: payload.colorbar,
            height: payload.height,
          };
    const { data } = await axiosClient.post('/get_radar_gif', payloadT);
    if (data.status !== 0) throw new Error("Error fetching Radar gif data");
    return data.data;
}

export const fetchSevipGifAnim = async (payload: SevipPayload): Promise<SpatialDataResponse> => {
  const { data } = await axiosClient.post("get_sevip_gif", payload);
  if (data.status !== 0) throw new Error('Error fetching Sevip gif data');
  return data.data  
}