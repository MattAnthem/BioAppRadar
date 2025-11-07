import { useAppSelector } from "../../../../store/hooks";
import { useClassifHistDataQuery } from "../useQuery/useClassifHistDataQuery";

export function useClassifData (enabled: boolean) {
    const payload = useAppSelector(state => state.historymap.classifPayloadHist);
    const query = useClassifHistDataQuery(payload, enabled);
    return query;
}