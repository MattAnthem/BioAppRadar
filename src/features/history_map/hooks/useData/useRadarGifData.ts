import { useAppSelector } from "../../../../store/hooks";
import { useRadarGifDataQuery } from "../useQuery/useRadarGifQuery";

export function useRadarGifData(enabled?: boolean) {
    const payload = useAppSelector((state) => state.historymap.radarGifPayloadHist);
    const query = useRadarGifDataQuery(payload, enabled);
    return query;
}