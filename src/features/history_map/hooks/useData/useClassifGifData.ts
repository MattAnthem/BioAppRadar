import { useAppSelector } from "../../../../store/hooks";
import { useClassifGifQuery } from "../useQuery/useClassifGifQuery";

export function useClassifGifData(enabled?: boolean) {
    const payload = useAppSelector((state) => state.historymap.classifGifPayloadHist);
    const query = useClassifGifQuery(payload, enabled);
    return query;
}