import { useQueryClient } from "@tanstack/react-query";
import type { ClassificationDataPayload, ClassificationDataResponse } from "../../../../api/endpoints/classificationAPI";
import type { RadarGridPayload, RadarPayload, RadarPolarPayload, SevipPayload, SpatialDataResponse } from "../../../../api/endpoints/spatialDataAPI";
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
    sevipPayload?: SevipPayload;
    radarPayload?: RadarGridPayload | RadarPolarPayload;
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
        sevipPayload?.parameter ?? '',
        colormap,
        { enabled: isSevip }
    )

    usePreloadRadarFrames(
        timeRange,
        colormap,
        radarPayload ?? ({} as RadarPayload),
        { enabled: isRadar && !!radarPayload}
    )

    

    // Getting The data 
    const { data: classifData, isLoading: isClassifLoading, error: classifError, isFetching: classifFectcing, isFetched: isClassifFetched  } = useClassificationDataQuery({
        class: classifPayload.class,
        time: currentTime,
        color_0: classifPayload.color_0,
        color_1: classifPayload.color_1,
        height: altitude,
    }, isClassification);

    const { data: sevipData, isLoading: isSevipLoading, error: sevipError, isFetching: sevipFetching, isFetched: isSevipFetched } = useSevipDataQuery(
        sevipPayload
        ? { parameter: sevipPayload.parameter, colorbar: colormap, time: currentTime }
        : ({} as SevipPayload),
        isSevip && !!sevipPayload
    );

    const { data: radarData, isLoading: isRadarLoading, error: radarError, isFetching: radarFetching, isFetched: isRadarFetched } = useRadarDataQuery(
        radarPayload
        ? { ...radarPayload, time: currentTime }
        : ({} as RadarPayload),
        isRadar && !!radarPayload
    );




    // Get the cached data
    const classifKey = ["classification_data", classifPayload.class, currentTime, classifPayload.color_0, classifPayload.color_1, altitude];
    const sevipKey = sevipPayload ? [ "sevip_data", sevipPayload.parameter, colormap, currentTime] : [];
    const radarKey = radarPayload ? [ "radar_data", radarPayload.parameter,  currentTime, radarPayload.type, colormap] : [];

    // Cached data
    const classifCached = queryClient.getQueryData<SpatialDataResponse>(classifKey) ?? null;
    const sevipCached = sevipKey.length ? queryClient.getQueryData<SpatialDataResponse>(sevipKey) ?? null : null;
    const radarCached = radarKey.length ? queryClient.getQueryData<SpatialDataResponse>(radarKey) ?? null : null;


    let data: SpatialDataResponse | ClassificationDataResponse | null = null;
    let isLoading = false;
    let isFetching = false;
    let isFetched = false;
    let error: unknown = null;

    switch (true) {
        case isClassification:
            data = classifData ?? classifCached;
            isLoading = isClassifLoading;
            isFetching = classifFectcing;
            isFetched = isClassifFetched;
            error = classifError
            break;
    
        case isSevip  && !!sevipPayload:
            data = sevipData ?? sevipCached;
            isLoading = isSevipLoading;
            isFetching = sevipFetching;
            isFetched = isSevipFetched;
            error = sevipError;
            break;
        case isRadar && !!radarPayload: 
            data = radarData ?? radarCached;
            isLoading = isRadarLoading;
            isFetching = radarFetching;
            isFetched = isRadarFetched;
            error = radarError
            break;
    }

    return { data, isLoading, error, isFetching, isFetched }
}