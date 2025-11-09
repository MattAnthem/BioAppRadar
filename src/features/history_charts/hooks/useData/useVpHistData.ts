import { useAppSelector } from "../../../../store/hooks";
import { useVpHistDataQuery } from "../useQuery/useVpHistDataQuery";

export function useVpHistData() {
   const payload = useAppSelector((state) => state.vp_histchart.vpPayload);
   const query = useVpHistDataQuery(payload);
   return query;
}