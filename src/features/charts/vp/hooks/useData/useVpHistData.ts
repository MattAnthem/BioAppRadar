import { useAppSelector } from "../../../../../store/hooks";
import { useVpHistDataQuery } from "../useQuery/useVpHistDataQuery";


export function useVpHistData(enabled?: boolean) {
   const payload = useAppSelector((state) => state.vp_histchart.vpPayload);
   const query = useVpHistDataQuery(payload, enabled);
   return query;
}