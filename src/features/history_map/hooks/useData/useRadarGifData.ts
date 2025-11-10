import { useAppSelector } from "../../../../store/hooks";
import { useRadarGifDataQuery } from "../useQuery/useRadarGifQuery";

export function useRadarData() {
    const payload = useAppSelector((state) => state.historymap.radarPayloadHist);
    const query = useRadarGifDataQuery(payload);
    return query;
}