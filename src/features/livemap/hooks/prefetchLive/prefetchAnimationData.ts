import { useQueryClient } from "@tanstack/react-query";
import type { ClassificationDataPayload, ClassificationDataResponse } from "../../../../api/endpoints/classificationAPI";
import type { RadarGridPayload, RadarPolarPayload, SevipPayload, SpatialDataResponse } from "../../../../api/endpoints/spatialDataAPI";
import { usePreloadClassificationFrames } from "../usePreload/usePreloadClassificationFrames";
import { useClassificationDataQuery } from "../useQuery/useClassificationQuery";
import { usePreloadSevipFrames } from "../usePreload/usePreloadSevipFrames";
import { useSevipDataQuery } from "../useQuery/useSevipQuery";
import { usePreloadRadarFrames } from "../usePreload/usePreloadRadarFrames";
import { useRadarDataQuery } from "../useQuery/useRadarDataQuery";


type PrefetchAnimationParams = {
    displayedData: 'radar' | 'sevip' | 'classification';
    timeRange: string[];
    currentTime: string;
    classifPayload: ClassificationDataPayload;
    sevipPayload: SevipPayload;
    radarPayload: RadarGridPayload | RadarPolarPayload;
    altitude: number; 
    colormap: string;
}

export const usePrefetchAnimationData = ({
    displayedData,
    timeRange,
    currentTime,
    classifPayload,
    sevipPayload,
    radarPayload,
    colormap,
    altitude,
}: PrefetchAnimationParams) => {

    const queryClient = useQueryClient();
    const isClassification = displayedData === "classification";
    const isSevip = displayedData === "sevip";
    const isRadar = displayedData === "radar";

    // Prefetch data in the given timerange
    usePreloadClassificationFrames(
        timeRange,
        classifPayload.class,
        classifPayload.color_0,
        classifPayload.color_1,
        altitude,
        { enabled: isClassification }
    )

    usePreloadSevipFrames(
        timeRange,
        sevipPayload.parameter,
        colormap,
        { enabled: isSevip }
    )

    usePreloadRadarFrames(
        timeRange,
        colormap,
        radarPayload,
        { enabled: isRadar }
    )

    

    // Getting The data 
    const { data: classifData, isLoading: isClassifLoading, error: classifError  } = useClassificationDataQuery({
        class: classifPayload.class,
        time: currentTime,
        color_0: classifPayload.color_0,
        color_1: classifPayload.color_1,
        height: altitude,
    }, isClassification);

    const { data: sevipData, isLoading: isSevipLoading, error: sevipError } = useSevipDataQuery({
        parameter: sevipPayload.parameter,
        colorbar: colormap,
        time: currentTime,
    } , isSevip);

    const { data: radarData, isLoading: isRadarLoading, error: radarError } = useRadarDataQuery({
         ...radarPayload, 
         time: currentTime 
    }, isRadar);




    // Get the cached data
    const classifKey = ["classification_data", classifPayload.class, currentTime, classifPayload.color_0, classifPayload.color_1, altitude];
    const sevipKey = [ "sevip_data", sevipPayload.parameter, colormap, currentTime];
    const radarKey = [ "radar_data", radarPayload.parameter,  currentTime, radarPayload.type, colormap]

    // Cached data
    const classifCached = queryClient.getQueryData<SpatialDataResponse>(classifKey) ?? null;
    const sevipCached = queryClient.getQueryData<SpatialDataResponse>(sevipKey) ?? null;
    const radarCached = queryClient.getQueryData<SpatialDataResponse>(radarKey) ?? null;


    let data: SpatialDataResponse | ClassificationDataResponse | null = null;
    let isLoading = true;
    let error: unknown = null;

    switch (true) {
        case isClassification:
            data = classifData ?? classifCached;
            isLoading = isClassifLoading;
            error = classifError
            break;
    
        case isSevip:
            data = sevipData ?? sevipCached;
            isLoading = isSevipLoading;
            error = sevipError;
            break;
        case isRadar: 
            data = radarData ?? radarCached;
            isLoading = isRadarLoading;
            error = radarError
            break;
    }

    return { data, isLoading, error }
}