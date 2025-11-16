import { useAppSelector } from "../../../../store/hooks";
import { useSevipGifQuery } from "../useQuery/useSevipGifQuery";

export function useSevipGifData(enabled?: boolean) {
    const payload = useAppSelector((state) => state.historymap.sevipGifPayloadHist);
    const query = useSevipGifQuery(payload, enabled);
    return query;
}