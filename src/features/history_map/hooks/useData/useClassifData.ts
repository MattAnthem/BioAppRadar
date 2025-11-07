import { useAppSelector } from "../../../../store/hooks";
import { useClassificationDataQuery } from "../../../livemap/hooks/useQuery/useClassificationQuery";

export function useClassifData (enabled: boolean) {
    const payload = useAppSelector(state => state.historymap.classifPayloadHist);
    const query = useClassificationDataQuery(payload, enabled);
    return query;
}