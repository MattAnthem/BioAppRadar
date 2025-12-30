import { axiosClient } from "../../axiosClient";
import type { ClassificationDataPayload, ClassificationDataResponse } from "./classificationAPI";
import type { RadarPayload, SevipPayload, SpatialDataResponse } from "./spatialDataAPI";

/**
 * Radar Gif animation overlay that returns a Base64 with other info, such as the bounds
 * @param payload : Radar data payload
 * @returns JSON 
 */
export const fetchRadarGifAnim = async (payload: RadarPayload): Promise<SpatialDataResponse> => {
    const payloadT = payload.type === "polar"
        ? {
            type: payload.type,
            parameter: payload.parameter,
            startTime: payload.startTime,
            endTime: payload.endTime,
            colorbar: payload.colorbar,
            elevation_angle: payload.elevation_angle,
            radarID: payload.radarID
          }
        : {
            type: payload.type,
            parameter: payload.parameter,
            startTime: payload.startTime,
            endTime: payload.endTime,
            colorbar: payload.colorbar,
            height: payload.height,
            radarID: payload.radarID
          };
    const { data } = await axiosClient.post('/get_radar_gif', payloadT);
    if (data.status !== 0) throw new Error("Error fetching Radar gif data");
    return data.data;
}

/**
 * Vertically integrated profile Gif overlay animation, returning a Base64 encoded gif overlay with bounds
 * @param payload : SevipPayload
 * @returns 
 */
export const fetchSevipGifAnim = async (payload: SevipPayload): Promise<SpatialDataResponse> => {
  const { data } = await axiosClient.post("/get_sevip_gif", payload);
  if (data.status !== 0) throw new Error('Error fetching Sevip gif data');
  return data.data;  
}

export const fetchClassificationAnim = async (payload: ClassificationDataPayload): Promise<ClassificationDataResponse> => {
  const { data } = await axiosClient.post("/get_bioclass_gif", payload);
  if (data.status !== 0) throw new Error('Error fetching Classification gif data');
  return data.data;
}